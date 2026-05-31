// ============================================================
// REGISTER/SIGN-UP PAGE - Trang dang ky mhm.vn
// ============================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly heading: Locator;
  readonly registerForm: Locator;
  readonly lastNameInput: Locator;
  readonly firstNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly recaptchaInput: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.locator('h1, h2, .page-title, .title, .heading').first();
    this.registerForm = page.locator('#create_customer');

    this.lastNameInput = page.locator('#lastName');
    this.firstNameInput = page.locator('#firstName');
    this.phoneInput = page.locator('#Phone');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');

    this.submitButton = page.locator('#create_customer button[type="submit"]');
    this.errorMessage = page.locator('#create_customer .form-signup[style*="color:red"]');
    this.recaptchaInput = page.locator('input[name="g-recaptcha-response"]');
  }

  async open(): Promise<void> {
    const candidates = ['/account/register'];

    for (const path of candidates) {
      await this.goto(path);
      if (await this.isRegisterFormVisible()) {
        return;
      }
    }

    await this.goto('/account/register');
  }

  async isRegisterFormVisible(): Promise<boolean> {
    const lastNameVisible = await this.lastNameInput.isVisible().catch(() => false);
    const emailVisible = await this.emailInput.isVisible().catch(() => false);
    return lastNameVisible && emailVisible;
  }

  async fillForm(data: {
    lastName?: string;
    firstName?: string;
    phone?: string;
    email?: string;
    password?: string;
  }): Promise<void> {
    if (data.lastName !== undefined) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.firstName !== undefined) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.phone !== undefined) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.password !== undefined) {
      await this.passwordInput.fill(data.password);
    }
  }

  // async submit2(): Promise<void> {
  //   await this.page.waitForTimeout(3000);

  //   // Kéo đến nút submit trước
  //   await this.submitButton.scrollIntoViewIfNeeded();

  //   // Chờ nút hiển thị
  //   await this.submitButton.waitFor({ state: 'visible' });

  //   // Click
  //   await this.submitButton.click();

  //   try {
  //     await this.recaptchaInput.waitFor({ state: 'attached', timeout: 2000 });

  //     await this.page.waitForFunction(
  //       () => {
  //         const el = document.querySelector<HTMLInputElement>(
  //           'input[name="g-recaptcha-response"]'
  //         );
  //         return !el || (el.value?.trim().length ?? 0) > 0;
  //       },
  //       undefined,
  //       { timeout: 8000 }
  //     );
  //   } catch { }

  //   await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
  // }


  async submit(): Promise<void> {
    // Kéo đến nút submit trước
    await this.submitButton.scrollIntoViewIfNeeded();

    // Chờ nút hiển thị
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();

    const isFormValid = await this.registerForm
      .evaluate((form: HTMLFormElement) => form.checkValidity())
      .catch(() => true);
    if (!isFormValid) {
      return;
    }

    // Wait for reCAPTCHA token to be set (if present) before continuing
    try {
      await this.recaptchaInput.waitFor({ state: 'attached', timeout: 2000 });
      await this.page.waitForFunction(
        () => {
          const el = document.querySelector<HTMLInputElement>('input[name="g-recaptcha-response"]');
          return !el || (el.value?.trim().length ?? 0) > 0;
        },
        undefined,
        { timeout: 8000 }
      );
    } catch {
      // Ignore if token cannot be obtained in automation
    }

    await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
  }



  async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent().catch(() => '');
    return text?.trim() ?? '';
  }
}

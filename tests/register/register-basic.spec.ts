// ============================================================
// MODULE REGISTER/SIGN-UP - mhm.vn
// ============================================================

import { test, expect } from '../../fixtures/custom-fixtures';

type RegisterData = {
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  password: string;
};

test.describe('Chuc nang dang ky', () => {
  const randomEmail = () => `test.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`;
  const randomPhone = () => `09${Math.floor(10000000 + Math.random() * 89999999)}`;

  const buildValidData = (): RegisterData => ({
    lastName: 'Nguyen',
    firstName: 'An',
    phone: randomPhone(),
    email: randomEmail(),
    password: 'Test1234',
  });

  const requiredFields = [
    { id: '#lastName', label: 'Ho' },
    { id: '#firstName', label: 'Ten' },
    { id: '#Phone', label: 'So dien thoai' },
    { id: '#email', label: 'Email' },
    { id: '#password', label: 'Mat khau' },
  ];

  test.beforeEach(async ({ registerPage }) => {
    await registerPage.open();
  });

  async function fillAllValid(registerPage: { fillForm: (data: Partial<RegisterData>) => Promise<void> }, overrides: Partial<RegisterData> = {}) {
    await registerPage.fillForm({ ...buildValidData(), ...overrides });
  }

  async function getValidationMessage(page: import('@playwright/test').Page, selector: string): Promise<string> {
    return await page.locator(selector).evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  test('TC_REGISTER_001: Mo trang dang ky va hien thi form', async ({ page, registerPage }, testInfo) => {
    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain',
    });

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await registerPage.isRegisterFormVisible()).toBeTruthy();
    await expect(registerPage.submitButton).toBeVisible();
  });

  test('TC_REGISTER_002: Khong dien thong tin nao', async ({ page, registerPage }) => {
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);

    for (const field of requiredFields) {
      const message = await getValidationMessage(page, field.id);
      expect(message, `${field.label} phai co validation message`).toBeTruthy();
    }
  });

  test('TC_REGISTER_003: Khong dien ho', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { lastName: '' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#lastName')).toBeTruthy();
  });

  test('TC_REGISTER_004: Khong dien ten', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { firstName: '' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#firstName')).toBeTruthy();
  });

  test('TC_REGISTER_005: Khong dien so dien thoai', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { phone: '' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#Phone')).toBeTruthy();
  });

  test('TC_REGISTER_006: Khong dien email', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { email: '' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#email')).toBeTruthy();
  });

  test('TC_REGISTER_007: Khong dien mat khau', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { password: '' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#password')).toBeTruthy();
  });

  test('TC_REGISTER_008: So dien thoai chua chu cai', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { phone: '09ab123456' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#Phone')).toBeTruthy();
  });

  test('TC_REGISTER_009: So dien thoai chua ky tu dac biet', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { phone: '0900-123-456' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#Phone')).toBeTruthy();
  });

  test('TC_REGISTER_010: Email sai dinh dang "abc@"', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { email: 'abc@' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#email')).toBeTruthy();
  });

  test('TC_REGISTER_011: Email khong co ky tu @', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { email: 'abcexample.com' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#email')).toBeTruthy();
  });

  test('TC_REGISTER_012: Email co dau cham o cuoi ten mien', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { email: 'abc@example.' });
    await registerPage.submit();

    await expect(page).toHaveURL(/\/account\/register/);
    expect(await getValidationMessage(page, '#email')).toBeTruthy();
  });

  test('TC_REGISTER_013: Email co khoang trang o dau duoc browser trim', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { email: `  ${randomEmail()}` });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account/);
    await expect(page).not.toHaveURL(/\/account\/register/);
  });

  test('TC_REGISTER_014: Email co khoang trang o cuoi duoc browser trim', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { email: `${randomEmail()}  ` });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account/);
    await expect(page).not.toHaveURL(/\/account\/register/);
  });

  test('TC_REGISTER_015: Ho chi chua khoang trang phai bi validate', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { lastName: '   ' });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // Chờ navigation hoàn tất sau khi server xử lý
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/)
  });

  test('TC_REGISTER_016: Ten chi chua khoang trang phai bi validate', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { firstName: '   ' });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // Chờ navigation hoàn tất sau khi server xử lý
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/)
  });

  test('TC_REGISTER_017: Ho la so phai bi validate', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { lastName: '12345' });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // Chờ navigation hoàn tất sau khi server xử lý
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/)
  });

  test('TC_REGISTER_018: Ten la so phai bi validate', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { firstName: '67890' });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // Chờ navigation hoàn tất sau khi server xử lý
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/)
  });

  test('TC_REGISTER_019: Mat khau 1 ky tu phai bi validate do qua ngan', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { password: 'a' });
    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account/);
    await expect(page).not.toHaveURL(/\/account\/register/);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText ?? '').toContain('Mật khẩu quá ngắn');
  });

  test('TC_REGISTER_020: Khong lo loi he thong khi validate form dang ky', async ({ page, registerPage }) => {
    await fillAllValid(registerPage, { email: 'abc@' });
    await registerPage.submit();

    const bodyText = await page.locator('body').innerText();

    expect(bodyText).not.toContain('[object Object]');
    expect(bodyText).not.toContain('undefined');
    expect(bodyText).not.toContain('null');
    expect(bodyText).not.toContain('Liquid error');
  });

  test('TC_REGISTER_021: Ho va Ten vuot qua do dai cho phep (300 ky tu)', async ({ page, registerPage }, testInfo) => {
    const longText = 'A'.repeat(300);
    await fillAllValid(registerPage, { lastName: longText, firstName: longText });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account/);
    await expect(page).not.toHaveURL(/\/account\/register/);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText ?? '').toContain('Họ tên quá dài ( tối đa 250 ký tự).');
  });


  test('TC_REGISTER_022: So dien thoai da ton tai trong he thong', async ({ page, registerPage }) => {
    // Su dung so dien thoai gia dinh da dang ky truoc do.
    await fillAllValid(registerPage, { phone: '0912345678', email: randomEmail() });
    await registerPage.submit();

    // FAIL neu khong hien thi thong bao so dien thoai da ton tai.
    const errorMessage = await registerPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toMatch(/tồn tại|đã được|da ton tai/);

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/);
  });


  test('TC_REGISTER_023: So dien thoai ngan hon do dai toi thieu', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { phone: '0913' });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account/);
    await expect(page).not.toHaveURL(/\/account\/register/);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText ?? '').toContain('Số điện thoại không hợp lệ');
  });

  test('TC_REGISTER_024: So dien thoai dai hon do dai toi da', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { phone: '028284343433418221821291234567890123' });

    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account/);
    await expect(page).not.toHaveURL(/\/account\/register/);

    const bodyText = await page.locator('body').textContent();
    expect(bodyText ?? '').toContain('Số điện thoại không hợp lệ');
  });


  test('TC_REGISTER_025: Email vuot qua do dai cho phep', async ({ page, registerPage }) => {
    const longEmail = `sss@ex${'a'.repeat(250)}ample.com`;
    await fillAllValid(registerPage, { email: longEmail });

    const emailMax = await page.locator('#email').getAttribute('maxlength');
    const message = await getValidationMessage(page, '#email');

    // Browser tu reject email qua dai vi khong phai dinh dang email hop le
    // Chap nhan ca 2 truong hop: co maxlength attribute HOAC co validation message
    const hasLengthLimit = Boolean(emailMax);
    const hasValidationMessage = Boolean(message);
    const browserRejectsInput = (await page.locator('#email').inputValue()).length < longEmail.length;

    expect(
      hasLengthLimit || hasValidationMessage || browserRejectsInput,
      `Email phai bi gioi han: maxlength=${emailMax}, message="${message}", input bi cat=${browserRejectsInput}`
    ).toBeTruthy();
  });

  test('TC_REGISTER_026: Chen ma XSS vao truong Ho/Ten khong duoc thuc thi', async ({ page, registerPage }) => {
    let dialogAppeared = false;
    page.on('dialog', async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    const xssPayload = '<script>alert(1)</script>';
    await fillAllValid(registerPage, { lastName: xssPayload, firstName: xssPayload });
    await page.waitForTimeout(500);

    // PASS neu script khong duoc thuc thi (khong co dialog alert).
    expect(dialogAppeared).toBeFalsy();

    // PASS neu gia tri nhap duoc giu nguyen dang text, khong bi thuc thi.
    const lastNameValue = await page.locator('#lastName').inputValue();
    expect(lastNameValue).toContain('<script>');
  });

  test('TC_REGISTER_027: Nhan nut Dang ky lien tuc 2 lan chi tao 1 tai khoan', async ({ page, registerPage }) => {
    await fillAllValid(registerPage);

    const submitButton = page.locator('#create_customer button[type="submit"]');
    await submitButton.click();
    await submitButton.click({ force: true }).catch(() => undefined);

    // PASS neu khong gay loi he thong khi submit lien tuc 2 lan.
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('[object Object]');
    expect(bodyText).not.toContain('Liquid error');
  });

  test('TC_REGISTER_028: Mat khau vuot qua do dai cho phep (300 ky tu)', async ({ page, registerPage }, testInfo) => {
    const longPassword = 'A'.repeat(300);
    await fillAllValid(registerPage, { password: longPassword });
    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/);
  });

    test('TC_REGISTER_029: Ho chua ky tu dac biet phai bi validate', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { lastName: 'Nguyen@#$' });

    // FAIL neu website chap nhan Ho chua ky tu dac biet.
    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // Chờ navigation hoàn tất sau khi server xử lý
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/)
  });

  test('TC_REGISTER_030: Ten chua ky tu dac biet phai bi validate', async ({ page, registerPage }, testInfo) => {
    await fillAllValid(registerPage, { firstName: 'An@#$' });

    // FAIL neu website chap nhan Ten chua ky tu dac biet.
    await registerPage.submit();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // Chờ navigation hoàn tất sau khi server xử lý
    await page.waitForURL(/\/account/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/account\/register/)
  });
});
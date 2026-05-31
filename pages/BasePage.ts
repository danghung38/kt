// ============================================================
// BASE PAGE - Lớp cha chung cho tất cả Page Object
// ============================================================

import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Điều hướng đến đường dẫn
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Lấy tiêu đề trang
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Lấy URL hiện tại
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Chờ trang load xong
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Scroll đến element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Lấy số lượng element khớp selector
   */
  async countElements(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }
}

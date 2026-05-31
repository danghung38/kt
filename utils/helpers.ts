// ============================================================
// HELPERS - Hàm tiện ích dùng chung
// ============================================================

import { Page } from '@playwright/test';

/**
 * Chờ trang load xong (networkidle)
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Lấy text content của element, trả về chuỗi rỗng nếu không tìm thấy
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  try {
    const text = await page.locator(selector).first().textContent();
    return text?.trim() || '';
  } catch {
    return '';
  }
}

/**
 * Kiểm tra element có tồn tại không
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    const count = await page.locator(selector).count();
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Format giá tiền từ chuỗi "36,990,000₫" thành số 36990000
 */
export function parsePrice(priceText: string): number {
  const cleaned = priceText.replace(/[₫,\s]/g, '');
  return parseInt(cleaned) || 0;
}

/**
 * Scroll xuống cuối trang
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

/**
 * Chụp screenshot với tên file theo timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: false,
  });
}

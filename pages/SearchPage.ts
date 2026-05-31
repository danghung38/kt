// ============================================================
// SEARCH PAGE - Trang kết quả tìm kiếm
// Phụ trách: Nguyễn Sỹ Huy Hoàng (CT070128)
// ============================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  // Kết quả tìm kiếm
  readonly resultList: Locator;
  readonly resultItems: Locator;
  readonly emptyMessage: Locator;
  readonly searchHeading: Locator;

  // Breadcrumb
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);

    this.resultList = page.locator(
      '.search-results, .products-grid, .collection-grid, ul.products, .product-list'
    ).first();

    // đúng class từ HTML thực tế của mhm.vn
    this.resultItems = page.locator('.product-info');

    this.emptyMessage = page.locator(
      '.search-no-results, .no-results, p:has-text("không tìm thấy"), p:has-text("Không tìm thấy"), p:has-text("Nhập từ khóa")'
    ).first();

    this.searchHeading = page.locator('h1, .page-title, .search-title').first();

    this.breadcrumb = page.locator('.breadcrumb, nav[aria-label="breadcrumb"]').first();
  }

async searchFromUI(keyword: string): Promise<void> {
  const searchInput = this.page.locator('form.search-bar input[name="q"]');
  const searchButton = this.page.locator('form.search-bar span.input-group-btn button[type="submit"]');

  await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  await searchInput.clear();
  await searchInput.fill(keyword);

  await searchButton.waitFor({ state: 'visible' });
  await searchButton.scrollIntoViewIfNeeded();
  
  // Fix: Thêm try-catch và fallback
  try {
    await Promise.all([
      this.page.waitForURL(/\/search/, { timeout: 15000 }),
      searchButton.click(),
    ]);
  } catch (error) {
    await Promise.all([
      this.page.waitForURL(/\/search/, { timeout: 15000 }),
      searchButton.click({ force: true }),
    ]);
  }

  await this.page.waitForLoadState('domcontentloaded');
}
  /**
   * Lấy số lượng kết quả tìm kiếm
   */
  async getResultCount(): Promise<number> {
    return await this.resultItems.count();
  }

  /**
   * Lấy tên sản phẩm đầu tiên trong kết quả
   */
  async getFirstProductName(): Promise<string> {
    const firstItem = this.resultItems.first();
    const name = await firstItem.locator('h3, h2, .product-title, .product-name, a').first().textContent();
    return name?.trim() || '';
  }

  /**
   * Lấy tất cả tên sản phẩm trong kết quả
   */
  async getAllProductNames(): Promise<string[]> {
    const names = await this.page
      .locator('.product-info .product-name a')
      .allTextContents();

    return names.map(name => name.trim());
  }

  /**
   * Click vào sản phẩm đầu tiên trong kết quả
   */
  async clickFirstProduct(): Promise<void> {
    await this.resultItems.first().locator('a').first().click();
    await this.waitForLoad();
  }

  /**
   * Kiểm tra URL có chứa từ khóa tìm kiếm không
   */
  isSearchUrl(keyword: string): boolean {
    const url = this.getCurrentUrl();
    return url.includes('/search') && url.includes(encodeURIComponent(keyword));
  }

  async getEmptyMessage(): Promise<string> {
  await this.emptyMessage.waitFor({ state: 'visible' });

  return (await this.emptyMessage.textContent())?.trim() ?? '';
}
  /**
   * Kiểm tra trang có hiển thị kết quả không (có ít nhất 1 sản phẩm)
   */
async hasResults(): Promise<boolean> {
    try {
        await this.resultItems.first().waitFor({ state: 'visible', timeout: 8000 });
        return true;
    } catch {
        return false;
    }
}
}

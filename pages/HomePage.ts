// ============================================================
// HOME PAGE - Trang chủ mhm.vn
// Phụ trách: Đặng Xuân Hùng (CT070129)
// ============================================================

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Header elements
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;

  // Navigation menu (quick links ở header)
  readonly navIphone: Locator;
  readonly navSamsung: Locator;
  readonly navXiaomi: Locator;
  readonly navOppo: Locator;

  // Product cards trên trang chủ
  readonly productCards: Locator;
  readonly flashSaleSection: Locator;

  constructor(page: Page) {
    super(page);

    // Header
    this.logo = page.locator('a.logo, .logo a, img[alt*="logo"], img[alt*="Minh Hoàng"]').first();
    this.searchInput = page.locator('input[name="q"], input[type="search"], input[placeholder*="tìm"], input[placeholder*="Tìm"]').first();
    this.cartIcon = page.locator('a[href="/cart"], .cart-icon, a.cart').first();
    this.cartCount = page.locator('a[href="/cart"] .count, .cart-count, .cart-icon .count').first();

    // Nav quick links
    this.navIphone = page.locator('a[href*="iphone"]').first();
    this.navSamsung = page.locator('a[href*="samsung"]').first();
    this.navXiaomi = page.locator('a[href*="xiaomi"]').first();
    this.navOppo = page.locator('a[href*="oppo"]').first();

    // Products
    this.productCards = page.locator('.product-item, .product-card, .item-product');
    this.flashSaleSection = page.locator('.flashsale, .flash-sale, [class*="flashsale"]').first();
  }

  /**
   * Mở trang chủ
   */
  async open(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Tìm kiếm sản phẩm bằng cách nhập từ khóa và nhấn Enter
   * mhm.vn dùng URL pattern: /search?q=keyword
   */
  async searchProduct(keyword: string): Promise<void> {
    // Thử fill vào input trước
    const inputVisible = await this.searchInput.isVisible().catch(() => false);
    if (inputVisible) {
      await this.searchInput.fill(keyword);
      await this.page.keyboard.press('Enter');
      await this.waitForLoad();
    } else {
      // Fallback: điều hướng trực tiếp đến URL tìm kiếm
      await this.page.goto(`/search?q=${encodeURIComponent(keyword)}`);
      await this.waitForLoad();
    }
  }

  /**
   * Lấy số lượng sản phẩm trong giỏ hàng từ badge
   */
  async getCartCount(): Promise<number> {
    try {
      const text = await this.cartCount.textContent({ timeout: 3000 });
      return parseInt(text?.trim() || '0') || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Click vào icon giỏ hàng
   */
  async clickCart(): Promise<void> {
    await this.cartIcon.click();
    await this.waitForLoad();
  }

  /**
   * Lấy danh sách tên sản phẩm hiển thị trên trang chủ
   */
  async getProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productCards.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const name = await this.productCards.nth(i).locator('h3, .product-title, .product-name').textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  /**
   * Click vào sản phẩm đầu tiên trong Flash Sale
   */
  async clickFirstFlashSaleProduct(): Promise<void> {
    const firstProduct = this.flashSaleSection.locator('a').first();
    await firstProduct.click();
    await this.waitForLoad();
  }
}

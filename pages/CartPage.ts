// ============================================================
// CART PAGE - Trang gio hang mhm.vn
// ============================================================

import { Page, Locator, APIResponse } from '@playwright/test';
import { BasePage } from './BasePage';

const BASE_URL = 'https://mhm.vn';

export class CartPage extends BasePage {
  readonly cartSection: Locator;
  readonly cartItems: Locator;
  readonly emptyCart: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);

    this.cartSection = page.locator('#cart-tab, .main-cart-page').first();
    this.cartItems = page.locator('.cart-tbody .item-cart, .header-cart-content .item-product');
    this.emptyCart = page.locator('.cart-empty, .title-cart:has-text("gio"), .title-cart:has-text("Hổng")').first();
    this.continueShoppingButton = page.locator('a.form-cart-continue, .cart-empty a[href="/"], a.btn-main').first();
    this.checkoutButton = page.getByRole('button', { name: /Thanh/i }).first();
    this.totalPrice = page.locator('.totals_price, .price_end, .shopping-cart-table-total .price, .header-cart-price .price').first();
  }

  async open(): Promise<void> {
    await this.goto('/cart');
    await this.waitForCartReady();
  }

  async clearCart(): Promise<APIResponse> {
    return await this.page.request.post(`${BASE_URL}/cart/clear.js`);
  }

  async addProductByVariantId(variantId: string, quantity: number = 1): Promise<APIResponse> {
    return await this.page.request.post(`${BASE_URL}/cart/add.js`, {
      form: {
        id: variantId,
        quantity: String(quantity),
      },
    });
  }

  async changeQuantity(variantId: string, quantity: number): Promise<APIResponse> {
    return await this.page.request.post(`${BASE_URL}/cart/change.js`, {
      form: {
        id: variantId,
        quantity: String(quantity),
      },
    });
  }

  async getCartJson(): Promise<{ item_count: number; total_price: number; items: Array<{ title: string; quantity: number; id: number }> }> {
    const response = await this.page.request.get(`${BASE_URL}/cart.js`);
    return await response.json();
  }

  async waitForCartReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');

    await Promise.race([
      this.cartItems.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined),
      this.emptyCart.waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined),
    ]);
  }

  async hasItems(): Promise<boolean> {
    await this.waitForCartReady();
    return (await this.cartItems.count()) > 0;
  }

  async getItemCount(): Promise<number> {
    await this.waitForCartReady();
    return await this.cartItems.count();
  }

  async getFirstProductName(): Promise<string> {
    const name = await this.cartItems.first().locator('.product-name a, a.text2line').first().textContent();
    return name?.trim() ?? '';
  }

  async getFirstQuantity(): Promise<number> {
    const value = await this.cartItems
      .first()
      .locator('input[name="Lines"], input.number-sidebar')
      .first()
      .inputValue();
    return Number(value);
  }

  async clickPlusOnFirstItem(): Promise<void> {
    await this.cartItems.first().locator('.btn-plus, .increase_pop').first().click();
    await this.page.waitForTimeout(500);
  }

  async clickMinusOnFirstItem(): Promise<void> {
    await this.cartItems.first().locator('.btn-minus, .reduced_pop').first().click();
    await this.page.waitForTimeout(500);
  }

  async removeFirstItem(): Promise<void> {
    await this.cartItems.first().locator('.remove-item-cart').first().click();
    await this.waitForCartReady();
  }

  async getTotalPriceText(): Promise<string> {
    const directText = (await this.totalPrice.textContent().catch(() => ''))?.trim() ?? '';
    if (directText) {
      return directText;
    }

    const visibleText = await this.page.locator('body').innerText().catch(() => '');
    const priceText = visibleText.match(/\d[\d,.]*\s*(?:₫|â‚«)/)?.[0] ?? '';
    return priceText.trim();
  }
}

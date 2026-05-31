// ============================================================
// MODULE CART - mhm.vn
// ============================================================

import { test, expect } from '../../fixtures/custom-fixtures';

const IPHONE_17_PRO_MAX_VARIANT_ID = '1158882495';
const PRODUCT_NAME = 'iPhone 17 Pro Max';

test.describe('Chuc nang gio hang', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.clearCart();
  });

  test.afterEach(async ({ cartPage }) => {
    await cartPage.clearCart();
  });

  test('TC_CART_001: Mo trang gio hang khi chua co san pham', async ({ page, cartPage }, testInfo) => {
    await cartPage.open();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain',
    });

    await expect(page).toHaveURL(/\/cart/);
    expect(await cartPage.hasItems()).toBeFalsy();
    await expect(cartPage.emptyCart).toBeVisible();
  });

  test('TC_CART_002: Tu trang chu click icon gio hang', async ({ page, homePage }, testInfo) => {
    await homePage.clickCart();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain',
    });

    await expect(page).toHaveURL(/\/cart/);
  });

  test('TC_CART_003: Them san pham vao gio hang bang endpoint add.js', async ({ cartPage }) => {
    const response = await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    const cart = await cartPage.getCartJson();

    expect(response.ok()).toBeTruthy();
    expect(cart.item_count).toBe(1);
    expect(cart.items[0].title).toContain(PRODUCT_NAME);
  });

  test('TC_CART_004: Gio hang hien thi san pham da them', async ({ page, cartPage }, testInfo) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain',
    });

    expect(await cartPage.hasItems()).toBeTruthy();
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getFirstProductName()).toContain(PRODUCT_NAME);
  });

  test('TC_CART_005: Them san pham voi so luong 2', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 2);
    await cartPage.open();

    expect(await cartPage.getFirstQuantity()).toBe(2);

    const cart = await cartPage.getCartJson();
    expect(cart.item_count).toBe(2);
  });

  test('TC_CART_006: Them cung mot san pham 2 lan thi cong don so luong', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);

    const cart = await cartPage.getCartJson();
    expect(cart.item_count).toBe(2);
    expect(cart.items[0].quantity).toBe(2);
  });

  test('TC_CART_007: Nut tang so luong tren UI lam tang gia tri input', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    await cartPage.clickPlusOnFirstItem();

    expect(await cartPage.getFirstQuantity()).toBe(2);
  });

  test('TC_CART_008: Nut giam so luong tren UI khong cho giam duoi 1', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    await cartPage.clickMinusOnFirstItem();

    expect(await cartPage.getFirstQuantity()).toBe(1);
  });

  test('TC_CART_009: Cap nhat so luong ve 3 bang endpoint change.js', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);

    const response = await cartPage.changeQuantity(IPHONE_17_PRO_MAX_VARIANT_ID, 3);
    const cart = await cartPage.getCartJson();

    expect(response.ok()).toBeTruthy();
    expect(cart.item_count).toBe(3);
    expect(cart.items[0].quantity).toBe(3);
  });

  test('TC_CART_010: Cap nhat so luong ve 0 de xoa san pham', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);

    const response = await cartPage.changeQuantity(IPHONE_17_PRO_MAX_VARIANT_ID, 0);
    const cart = await cartPage.getCartJson();

    expect(response.ok()).toBeTruthy();
    expect(cart.item_count).toBe(0);
  });

  test('TC_CART_011: Nut tiep tuc mua hang tren gio hang rong quay ve trang chu', async ({ page, cartPage }) => {
    await cartPage.open();
    await cartPage.continueShoppingButton.click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL('https://mhm.vn/');
  });

  test('TC_CART_012: Gio hang co san pham hien thi tong tien', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    const totalText = await cartPage.getTotalPriceText();
    expect(totalText).toMatch(/\d/);
    expect(totalText).toContain('₫');
  });

  test('TC_CART_013: Gio hang co san pham hien thi nut thanh toan', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    await expect(cartPage.checkoutButton).toBeVisible();
  });

  test('TC_CART_014: Reload trang gio hang van giu san pham', async ({ page, cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();
    await page.reload();
    await cartPage.waitForCartReady();

    expect(await cartPage.hasItems()).toBeTruthy();
    expect(await cartPage.getFirstProductName()).toContain(PRODUCT_NAME);
  });

  test('TC_CART_015: Khong hien thi loi he thong tren trang gio hang', async ({ page, cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    const bodyText = await page.locator('body').innerText();

    expect(bodyText).not.toContain('[object Object]');
    expect(bodyText).not.toContain('undefined');
    expect(bodyText).not.toContain('null');
    expect(bodyText).not.toContain('Liquid error');
  });

  test('TC_CART_016: Tang so luong tren UI phai dong bo vao gio hang server', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    await cartPage.clickPlusOnFirstItem();

    const cart = await cartPage.getCartJson();

    // FAIL neu UI chi tang input nhung chua cap nhat gio hang tren server.
    expect(cart.item_count).toBe(2);
  });

  test('TC_CART_017: Nut thanh toan phai dieu huong truc tiep den checkout', async ({ cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    await expect(cartPage.checkoutButton).toBeVisible();

    // FAIL neu website dung button xu ly bang JavaScript va khong co href /checkout.
    await expect(cartPage.checkoutButton).toHaveAttribute('href', /checkout/);
  });

  test('TC_CART_018: O so luong phai co ten truy cap ro rang', async ({ page, cartPage }) => {
    await cartPage.addProductByVariantId(IPHONE_17_PRO_MAX_VARIANT_ID, 1);
    await cartPage.open();

    const quantityInput = page
      .locator('.cart-tbody .item-cart input[name="Lines"], .header-cart-content .item-product input[name="Lines"]')
      .first();

    // FAIL neu input khong co label/aria-label "So luong" cho screen reader.
    await expect(quantityInput).toHaveAccessibleName(/Số lượng|So luong/i);
  });
});

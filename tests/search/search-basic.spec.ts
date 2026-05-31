
// ============================================================
// MODULE TÌM KIẾM - NHÓM 1: TÌM KIẾM CƠ BẢN (TC_SEARCH_001-015)
// Phụ trách: Nguyễn Sỹ Huy Hoàng (CT070128)
// ============================================================

import { test, expect } from '../../fixtures/custom-fixtures';
import { SearchPage } from '../../pages/SearchPage';

test.describe('Chức năng tìm kiếm', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Mở trang chủ trước mỗi testcase
    await page.goto('https://mhm.vn');
    await page.waitForLoadState('domcontentloaded');
  });




  // ============================================================
  // TESTING


  test('TC_SEARCH_001: Tìm kiếm sản phẩm với từ khóa "samsung"', async ({ page }, testInfo) => {
    await searchPage.searchFromUI('samsung');

    // PASS: Chuyển đúng trang tìm kiếm
    await expect(page).toHaveURL(/\/search/);

    // THÊM URL VÀO REPORT
    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: Có kết quả hiển thị
    expect(await searchPage.hasResults()).toBeTruthy();

    // PASS: Tất cả title đều chứa "samsung"
    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  });

  test('TC_SEARCH_002: Tìm kiếm sản phẩm với từ khóa "saMsUNG"', async ({ page }, testInfo) => {
    await searchPage.searchFromUI('saMsUNG');

    // PASS: Chuyển đúng trang tìm kiếm
    await expect(page).toHaveURL(/\/search/);

    // THÊM URL VÀO REPORT
    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: Có kết quả hiển thị
    expect(await searchPage.hasResults()).toBeTruthy();

    // PASS: Tất cả title đều chứa "samsung" (case-insensitive)
    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  });

  test('TC_SEARCH_003: Tìm kiếm với từ khóa có khoảng trắng đầu "    samsung"', async ({ page }, testInfo) => {

    await searchPage.searchFromUI('    samsung');

    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    expect(await searchPage.hasResults()).toBeTruthy();

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  });

  test('TC_SEARCH_004: Tìm kiếm với từ khóa có khoảng trắng cuối "samsung     "', async ({ page }, testInfo) => {

    await searchPage.searchFromUI('samsung     ');

    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    expect(await searchPage.hasResults()).toBeTruthy();

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  });


  test('TC_SEARCH_005: Tìm kiếm với từ khóa có khoảng trắng đầu và cuối "     samsung      "', async ({ page }, testInfo) => {

    await searchPage.searchFromUI('     samsung      ');

    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    expect(await searchPage.hasResults()).toBeTruthy();

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('samsung');
    }
  });

  test('TC_SEARCH_006: Tìm kiếm sai chính tả "sam sung"', async ({ page }, testInfo) => {

    await searchPage.searchFromUI('sam sung');

    //pass: Chuyển đúng trang tìm kiếm
    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: KHÔNG có kết quả
    expect(await searchPage.hasResults()).toBeFalsy();
  });




  test('TC_SEARCH_007: Tìm kiếm sản phẩm với từ khóa "iphone"', async ({ page }, testInfo) => {

    const keyword = 'iphone';

    // Bước thực hiện
    await searchPage.searchFromUI(keyword);

    // PASS: Chuyển đúng trang tìm kiếm
    await expect(page).toHaveURL(/\/search/);

    // THÊM URL VÀO REPORT
    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: Có kết quả hiển thị
    expect(await searchPage.hasResults()).toBeTruthy();

    // PASS: Tất cả title đều chứa "iphone" (case-insensitive)
    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain(keyword);
    }
  });


  test('TC_SEARCH_008: Tìm kiếm với ký tự đặc biệt', async ({ page }, testInfo) => {

    const keyword = '@@@###';

    await searchPage.searchFromUI(keyword);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: Chuyển đúng trang tìm kiếm
    await expect(page).toHaveURL(/\/search/);

    // PASS: KHÔNG có kết quả
    expect(await searchPage.hasResults()).toBeFalsy();
  });


  test('TC_SEARCH_009: Tìm kiếm tiếng Việt với từ khóa "đồng hồ"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('đồng hồ');
    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('đồng hồ');
    }

    // PASS: Search tiếng Việt hoạt động
    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_010: Tìm kiếm với tên đầy đủ "iphone 17 pro max"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('iphone 17 pro max');

    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('iphone 17 pro max');
    }

    // PASS: Search tiếng Việt hoạt động
    expect(await searchPage.hasResults()).toBeTruthy();
  });


  test('TC_SEARCH_011: Không lộ query nội bộ vào ô tìm kiếm', async ({ page }) => {

    // Bước thực hiện
    await searchPage.searchFromUI('@@');

    const bodyText = await page.locator('body').textContent();

    // FAIL: Không được hiển thị query nội bộ
    expect(bodyText).not.toContain('filter=');
    expect(bodyText).not.toContain('title:product');

    // FAIL: Không được hiển thị lỗi hệ thống
    expect(bodyText).not.toContain('[object Object]');
    expect(bodyText).not.toContain('undefined');
    expect(bodyText).not.toContain('null');

    // PASS: Hiển thị thông báo thân thiện
    await expect(searchPage.emptyMessage).toBeVisible();

    //PASS KHÔNG có kết quả
    expect(await searchPage.hasResults()).toBeFalsy();
  });



  test('TC_SEARCH_012: Tìm kiếm với model "s26"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('s26');


    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('s26');
    }

    // PASS: Search tiếng Việt hoạt động
    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_013: Không cho phép tìm kiếm với chuỗi chỉ chứa khoảng trắng', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('   ');

    // Thêm URL vào report
    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: Không được chuyển sang trang search
    await expect(page).not.toHaveURL(/\/search/);

    // PASS: Hiển thị thông báo lỗi validate
    const errorMessage = await searchPage.getEmptyMessage();
    expect(errorMessage.toLowerCase()).toContain('không được để trống');
  });

  test('TC_SEARCH_014: Tìm kiếm tiếng Việt với từ khóa "CỦ SẠC"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('CỦ SẠC');
    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('củ sạc');
    }

    // PASS: Search tiếng Việt hoạt động
    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_015: Tìm kiếm tiếng Việt không dấu với từ khóa "cu sac"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('cu sac');
    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('củ sạc');
    }

    // PASS: Search tiếng Việt hoạt động
    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_016: Tìm kiếm tiếng Việt gần đúng với từ khóa "cU SẠC"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('cU SẠC');
    await expect(page).toHaveURL(/\/search/);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('củ sạc');
    }

    // PASS: Search tiếng Việt hoạt động
    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_017: Tìm kiếm với tiếng Việt có khoảng trắng cuối "củ sạc   "', async ({ page }) => {

    await searchPage.searchFromUI('củ sạc   ');
    await expect(page).toHaveURL(/\/search/);

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('củ sạc');
    }

    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_018: Tìm kiếm với tiếng Việt có khoảng trắng đầu "   củ sạc"', async ({ page }) => {

    await searchPage.searchFromUI('   củ sạc');
    await expect(page).toHaveURL(/\/search/);

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('củ sạc');
    }

    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_019: Tìm kiếm với tiếng Việt có khoảng trắng đầu/cuối "   củ sạc   "', async ({ page }) => {

    await searchPage.searchFromUI('   củ sạc   ');
    await expect(page).toHaveURL(/\/search/);

    const productNames = await searchPage.getAllProductNames();

    for (const name of productNames) {
      expect(name.toLowerCase()).toContain('củ sạc');
    }

    expect(await searchPage.hasResults()).toBeTruthy();
  });

  test('TC_SEARCH_020: Tìm kiếm với tiếng Việt có khoảng trắng đầu/cuối và viết hoa "   CỦ SẠC   "', async ({ page }) => {

  await searchPage.searchFromUI('   CỦ SẠC   ');
  await expect(page).toHaveURL(/\/search/);

  const productNames = await searchPage.getAllProductNames();

  for (const name of productNames) {
    expect(name.toLowerCase()).toContain('củ sạc');
  }

  expect(await searchPage.hasResults()).toBeTruthy();
});

  test('TC_SEARCH_021: Tìm kiếm tiếng Việt gần đúng với giá "5 triệu"', async ({ page }, testInfo) => {

    // Bước thực hiện
    await searchPage.searchFromUI('5 triệu');
    await expect(page).toHaveURL(/\/search/);
    await testInfo.attach('Current URL', { body: page.url(), contentType: 'text/plain' });

    // PASS: Hệ thống tìm theo tên sản phẩm, không tìm theo giá
    // nên "5 triệu" không trả về kết quả nào
    expect(await searchPage.hasResults()).toBeFalsy();
  });

    test('TC_SEARCH_022: Không lộ query nội bộ trên URL tìm kiếm', async ({ page }) => {

    // Bước thực hiện
    await searchPage.searchFromUI('kkkk');

    const url = page.url();

    // PASS: Chuyển đúng trang tìm kiếm
    expect(url).toContain('/search');

    // FAIL: Không được lộ query nội bộ
    expect(url).not.toContain('filter=');
    expect(url).not.toContain('title:product');
    expect(url).not.toContain('contains');
    expect(url).not.toContain('adjacent');
    expect(url).not.toContain('sku:');

    // PASS: URL chứa keyword người dùng nhập
    expect(url.toLowerCase()).toContain('kkkk');

    // PASS: KHÔNG có kết quả
    expect(await searchPage.hasResults()).toBeFalsy();
  });

  test('TC_SEARCH_023: Không cho phép tìm kiếm khi ô tìm kiếm trống', async ({ page }, testInfo) => {
    const searchInput = page.locator('form.search-bar input[name="q"]');
    const searchButton = page.locator('form.search-bar span.input-group-btn button[type="submit"]');

    await searchInput.clear();
    await searchButton.click();

    // Lấy validationMessage ngay sau click
    const validationMessage: string = await searchInput.evaluate(
        (el: HTMLInputElement) => el.validationMessage
    );

    await testInfo.attach('Current URL', {
        body: page.url(),
        contentType: 'text/plain'
    });

    await testInfo.attach('Validation Message', {
        body: validationMessage,
        contentType: 'text/plain'
    });

    // PASS: Không chuyển sang trang search
    await expect(page).not.toHaveURL(/\/search/);

    // PASS: Vẫn ở trang chủ
    await expect(page).toHaveURL('https://mhm.vn');

    // PASS: Browser hiện validation
    expect(validationMessage).toBeTruthy();
});

 test('TC_SEARCH_024: Tìm kiếm với chuỗi ký tự dài', async ({ page }, testInfo) => {

    const keyword = 'gdfhseuadhncjákwidahdbábjbfjssfyưyiuewihcbsnjcusnjkzshncjijssfsf';

    await searchPage.searchFromUI(keyword);

    await testInfo.attach('Current URL', {
      body: page.url(),
      contentType: 'text/plain'
    });

    // PASS: Chuyển đúng trang tìm kiếm
    await expect(page).toHaveURL(/\/search/);

    // PASS: KHÔNG có kết quả
    expect(await searchPage.hasResults()).toBeFalsy();
  });


  test('TC_SEARCH_025: Tìm kiếm với 1 ký tự thường "a', async ({ page }) => {

  await searchPage.searchFromUI('a');
  await expect(page).toHaveURL(/\/search/);

  expect(await searchPage.hasResults()).toBeTruthy();

  const productNames = await searchPage.getAllProductNames();

  for (const name of productNames) {
    expect(name.toLowerCase()).toContain('a');
  }

});

  test('TC_SEARCH_026: Tìm kiếm với 1 ký tự hoa "A', async ({ page }) => {

  await searchPage.searchFromUI('A');
  await expect(page).toHaveURL(/\/search/);

  expect(await searchPage.hasResults()).toBeTruthy();

  const productNames = await searchPage.getAllProductNames();

  for (const name of productNames) {
    expect(name.toLowerCase()).toContain('a');
  }

});

  test('TC_SEARCH_027: Tìm kiếm với 1 ký tự "i"', async ({ page }) => {

  await searchPage.searchFromUI('i');
  await expect(page).toHaveURL(/\/search/);

  expect(await searchPage.hasResults()).toBeTruthy();

  const productNames = await searchPage.getAllProductNames();

  for (const name of productNames) {
    expect(name.toLowerCase()).toContain('i');
  }

});


  test('TC_SEARCH_028: Tìm kiếm với 1 ký tự "p"', async ({ page }) => {

  await searchPage.searchFromUI('p');
  await expect(page).toHaveURL(/\/search/);

  expect(await searchPage.hasResults()).toBeTruthy();

  const productNames = await searchPage.getAllProductNames();

  for (const name of productNames) {
    expect(name.toLowerCase()).toContain('p');
  }

});
 
});

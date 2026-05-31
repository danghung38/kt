# 🧪 MHM Playwright Testing

Dự án kiểm thử tự động website **https://mhm.vn** (Minh Hoàng Mobile - Hải Phòng) bằng Playwright + TypeScript.

## 👥 Nhóm thực hiện

| MSSV | Họ tên | Module phụ trách |
|------|--------|-----------------|
| CT070128 | Nguyễn Sỹ Huy Hoàng | Tìm kiếm sản phẩm (50 TC) |
| CT070129 | Đặng Xuân Hùng | Xem chi tiết & Điều hướng (50 TC) |
| CT070111 | Vũ Văn Đảng | Giỏ hàng - Cart (50 TC) |

**Tổng: 150 testcase**

---

## 📁 Cấu trúc project

```
mhm-playwright-testing/
├── tests/
│   ├── search/
│   │   ├── search.spec.ts              # 15 TC cũ (giữ lại)
│   │   ├── search-basic.spec.ts        # TC 001-015 (15 TC)
│   │   ├── search-negative.spec.ts     # TC 016-028 (13 TC)
│   │   ├── search-data-driven.spec.ts  # TC 029-038 (10 TC)
│   │   ├── search-navigation.spec.ts   # TC 039-046 (8 TC)
│   │   └── search-advanced.spec.ts     # TC 047-050 (4 TC)
│   ├── product-detail/
│   │   ├── product-detail.spec.ts      # 20 TC cũ (giữ lại)
│   │   ├── detail-info.spec.ts         # TC 001-015 (15 TC)
│   │   ├── detail-variants.spec.ts     # TC 016-025 (10 TC)
│   │   ├── detail-navigation.spec.ts   # TC 026-040 (15 TC)
│   │   ├── detail-data-driven.spec.ts  # TC 041-048 (8 TC)
│   │   └── detail-advanced.spec.ts     # TC 049-050 (2 TC)
│   └── cart/
│       ├── cart.spec.ts                # 15 TC cũ (giữ lại)
│       ├── cart-basic.spec.ts          # TC 001-012 (12 TC)
│       ├── cart-add.spec.ts            # TC 013-025 (13 TC)
│       ├── cart-actions.spec.ts        # TC 026-035 (10 TC)
│       ├── cart-data-driven.spec.ts    # TC 036-045 (10 TC)
│       └── cart-advanced.spec.ts       # TC 046-050 (5 TC)
├── pages/                              # Page Object Model
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── SearchPage.ts
│   ├── ProductDetailPage.ts
│   └── CartPage.ts
├── fixtures/
│   ├── test-data.json                  # Dữ liệu test cơ bản
│   ├── search-keywords.json            # Keywords cho data-driven
│   ├── products-list.json              # Danh sách sản phẩm
│   └── custom-fixtures.ts              # Custom fixtures (test.extend)
├── utils/
│   ├── helpers.ts
│   └── constants.ts
├── playwright.config.ts                # Chromium + Firefox
├── .env
└── README.md
```

---

## 🎯 Kỹ thuật kiểm thử áp dụng

| Kỹ thuật | Mô tả | Áp dụng ở |
|----------|-------|-----------|
| **Page Object Model** | Tách biệt UI và logic test | Tất cả module |
| **Custom Fixtures** | `test.extend()` tái sử dụng page objects | `fixtures/custom-fixtures.ts` |
| **Data-driven Testing** | Loop qua JSON data | `*-data-driven.spec.ts` |
| **Boundary Value Analysis** | Test giá trị biên min/max/over | `search-negative.spec.ts` |
| **Equivalence Partitioning** | Nhóm input tương đương | `search-negative.spec.ts` |
| **Negative Testing** | Input rỗng, đặc biệt, không tồn tại | `search-negative.spec.ts` |
| **Soft Assertions** | `expect.soft()` check nhiều điều kiện | `*-advanced.spec.ts` |
| **Cross-browser** | Chromium + Firefox | `playwright.config.ts` |
| **Network Spy** | Đếm request khi search | `search-advanced.spec.ts` |
| **Test Tags** | `@smoke`, `@regression` | Tất cả file |

---

## 🚀 Cài đặt & Chạy

```bash
# Cài dependencies
npm install

# Cài browsers
npx playwright install chromium firefox

# Chạy tất cả test (Chromium + Firefox)
npm test

# Chạy chỉ Chromium
npm run test:chromium

# Chạy chỉ Firefox
npm run test:firefox

# Chạy từng module
npm run test:search
npm run test:detail
npm run test:cart

# Chạy theo tag
npm run test:smoke       # Chỉ smoke test (nhanh)
npm run test:regression  # Toàn bộ regression

# Chạy có giao diện (headed)
npm run test:headed

# Xem báo cáo HTML
npm run report
```

---

## 📊 Tổng số testcase: 150

| Module | File | TC |
|--------|------|----|
| Search | search-basic.spec.ts | 15 |
| Search | search-negative.spec.ts | 13 |
| Search | search-data-driven.spec.ts | 10 |
| Search | search-navigation.spec.ts | 8 |
| Search | search-advanced.spec.ts | 4 |
| **Search tổng** | | **50** |
| Detail | detail-info.spec.ts | 15 |
| Detail | detail-variants.spec.ts | 10 |
| Detail | detail-navigation.spec.ts | 15 |
| Detail | detail-data-driven.spec.ts | 8 |
| Detail | detail-advanced.spec.ts | 2 |
| **Detail tổng** | | **50** |
| Cart | cart-basic.spec.ts | 12 |
| Cart | cart-add.spec.ts | 13 |
| Cart | cart-actions.spec.ts | 10 |
| Cart | cart-data-driven.spec.ts | 10 |
| Cart | cart-advanced.spec.ts | 5 |
| **Cart tổng** | | **50** |
| **TỔNG CỘNG** | | **150** |

---

## 🏷️ Test Tags

```bash
@smoke      # Test quan trọng nhất, chạy nhanh (~20 TC)
@regression # Toàn bộ test, chạy đầy đủ (~150 TC)
@negative   # Chỉ test negative/boundary
@network    # Test liên quan đến network request
```

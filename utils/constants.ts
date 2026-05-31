// ============================================================
// CONSTANTS - Hằng số dùng chung toàn project
// Website: https://mhm.vn (Minh Hoàng Mobile - Hải Phòng)
// ============================================================

export const BASE_URL = 'https://mhm.vn';

export const URLS = {
  HOME: '/',
  SEARCH: '/search',
  CART: '/cart',
  IPHONE_COLLECTION: '/collections/iphone',
  PRODUCT_IPHONE_17_PRO_MAX: '/products/iphone-17-pro-max-hai-phong',
  PRODUCT_SAMSUNG_S25: '/products/samsung-galaxy-s25-plus-phan-phoi-chinh-hang',
  PRODUCT_REDMI_15: '/products/redmi-15-phan-phoi-chinh-hang',
};

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 15000,
  LONG: 30000,
};

export const SEARCH_KEYWORDS = {
  VALID: ['iphone', 'samsung', 'xiaomi', 'oppo', 'ipad'],
  INVALID: ['xyzabc999notexist', 'aaabbbccc123456'],
  SPECIAL_CHARS: ['@#$%', '<script>', "' OR 1=1"],
  EMPTY: '',
  LONG_STRING: 'a'.repeat(200),
  VIETNAMESE: ['điện thoại', 'màn hình', 'pin sạc'],
};

export const PRODUCT_SLUGS = {
  IPHONE_17_PRO_MAX: 'iphone-17-pro-max-hai-phong',
  IPHONE_17: 'iphone-17-hai-phong',
  SAMSUNG_S26_ULTRA: 'samsung-galaxy-s26-ultra-phan-phoi-chinh-hang',
  REDMI_15: 'redmi-15-phan-phoi-chinh-hang',
};

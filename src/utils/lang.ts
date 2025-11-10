export const strings = {
  en: {
    'title': 'Personal Blog',
    'description': 'Based on Astro + Angular',
    'nav.docs': 'Docs',
    'nav.about': 'About Me',
    'nav.products': 'Products',
    'settings': 'Settings',
    'settings.close': 'Close',
    'nav.search.placeholder': 'Search the documentation…',
    'nav.search.loading': 'Loading search index…',
    'nav.search.no_results': 'No matching documents found.',
    'nav.search.error': 'Unable to load search index. Please try again.',
    'nav.search.aria': 'Search articles',
    'nav.search.clear': 'Clear search query',
    'language': 'Language',
    'language.en': 'English',
    'language.vi': 'Vietnamese',
    'theme': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System (Auto)',
    'right_panel.no_headings': 'There is no table of contents for this page.'
    // …
  },
  vi: {
    'title': 'Blog cá nhân',
    'description': 'Xây dựng với Astro + Angular',
    'nav.docs': 'Tài liệu',
    'nav.about': 'Giới thiệu',
    'nav.products': 'Dự án khác',
    'settings': 'Cài đặt',
    'settings.close': 'Đóng',
    'nav.search.placeholder': 'Tìm kiếm nội dung…',
    'nav.search.loading': 'Đang tải dữ liệu tìm kiếm…',
    'nav.search.no_results': 'Không tìm thấy kết quả phù hợp.',
    'nav.search.error': 'Không thể tải dữ liệu tìm kiếm. Vui lòng thử lại.',
    'nav.search.aria': 'Tìm kiếm bài viết',
    'nav.search.clear': 'Xóa từ khóa tìm kiếm',
    'language': 'Ngôn ngữ',
    'language.en': 'Tiếng Anh',
    'language.vi': 'Tiếng Việt',
    'theme': 'Giao diện',
    'theme.light': 'Sáng',
    'theme.dark': 'Tối',
    'theme.system': 'Hệ thống (Tự động)',
    'right_panel.no_headings': 'Không có mục lục cho trang này.',
    // …
  },
} as const;

export const languages = Object.keys(strings) as Languages[];

export type Languages = keyof typeof strings;
export type Strings = keyof (typeof strings)[keyof typeof strings];

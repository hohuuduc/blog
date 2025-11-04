export const strings = {
  en: {
    'nav.docs': 'Docs',
    'nav.about': 'About Me',
    'nav.products': 'Products',
    'settings': 'Settings',
    'language': 'Language',
    'language.en': 'English',
    'language.vi': 'Vietnamese',
    'theme': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System (Auto)',
    // …
  },
  vi: {
    'nav.docs': 'Tài liệu',
    'nav.about': 'Giới thiệu',
    'nav.products': 'Dự án khác',
    'settings': 'Cài đặt',
    'language': 'Ngôn ngữ',
    'language.en': 'Tiếng Anh',
    'language.vi': 'Tiếng Việt',
    'theme': 'Giao diện',
    'theme.light': 'Sáng',
    'theme.dark': 'Tối',
    'theme.system': 'Hệ thống (Tự động)',
    // …
  },
} as const;

export const languages = Object.keys(strings) as Languages[];

export type Languages = keyof typeof strings;
export type Strings = keyof (typeof strings)[keyof typeof strings];
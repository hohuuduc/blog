import type { strings } from "@utils/lang";

export interface NavigationPage {
  title: string;
  href: string;
}

export interface NavGroup {
  label: keyof (typeof strings)[keyof typeof strings];
  href: string;
  pages: NavigationPage[];
}

export interface SidebarItem {
  title: string;
  slug: string;
  group?: string;
  href: string;
}

export interface HeadingLink {
  depth: number;
  slug: string;
  text: string;
}

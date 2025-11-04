import type { Strings } from "@utils/lang";

export interface NavItem {
  label: Strings;
  href?: string;
  pages?: {
    title: string;
    href: string;
  }[];
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

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
  href: string;
}

export interface HeadingLink {
  depth: number;
  slug: string;
  text: string;
}

export interface SidebarTreeNode {
  id: string;
  label: string;
  slug?: string;
  href?: string;
  children?: SidebarTreeNode[];
}
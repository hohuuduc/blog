import type { CollectionEntry } from 'astro:content';
import type { Heading } from 'astro:content';
import type { Languages } from './lang';

export interface NavData {
  sidebarItems: {
    title: string;
    slug: string;
    group?: string;
    href: string;
  }[];
  baseHref: string;
}

const NAV_LABELS: Record<string, string> = {
  docs: 'Docs',
  information: 'Information',
  playground: 'Playground',
  other: 'Other'
};

export function resolveBaseSegment() {
  const raw =
    import.meta.env.URL_PAGE ??
    import.meta.env.PUBLIC_URL_PAGE ??
    process.env.URL_PAGE ??
    process.env.PUBLIC_URL_PAGE ??
    '';
  const trimmed = raw.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.replace(/^\/+|\/+$/g, '');
}

export function buildNavigation(entries: CollectionEntry<'blog'>[], lang: Languages): NavData {
  const filter = entries.filter((entry) => entry.id.split("/")[0] === lang);
  const baseSegment = resolveBaseSegment();
  const basePrefix = baseSegment ? `/${baseSegment}` : '';
  const homeHref = basePrefix || '/';

  const buildHref = (slug: string) => {
    const trimmedSlug = slug.replace(/^\/+/, '');
    if (!trimmedSlug) {
      return homeHref;
    }
    return basePrefix ? `${basePrefix}/${trimmedSlug}` : `/${trimmedSlug}`;
  };

  const sorted = [...filter].sort((a, b) => {
    const orderA = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.data.title.localeCompare(b.data.title, 'vi');
  });

  const sidebarItems = sorted.map((entry) => ({
    title: entry.data.title,
    slug: entry.slug,
    href: buildHref(entry.slug)
  }));

  return { sidebarItems, baseHref: homeHref };
}

export function mapHeadings(headings: Heading[]): {
  depth: number;
  slug: string;
  text: string;
}[] {
  return headings
    .filter((heading) => heading.depth > 1 && heading.depth <= 4)
    .map((heading) => ({
      depth: heading.depth,
      slug: heading.slug,
      text: heading.text
    }));
}

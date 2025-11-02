import type { CollectionEntry } from 'astro:content';
import type { Heading } from 'astro:content';

export interface NavData {
  navGroups: {
    id: string;
    label: string;
    href: string;
    pages: {
      title: string;
      slug: string;
      description?: string;
      navGroup: 'docs' | 'information' | 'playground' | 'other';
      href: string;
    }[];
  }[];
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

export function buildNavigation(entries: CollectionEntry<'pages'>[]): NavData {
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

  const sorted = [...entries].sort((a, b) => {
    const orderA = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.data.title.localeCompare(b.data.title, 'vi');
  });

  const navMap = new Map<string, CollectionEntry<'pages'>[]>();
  for (const entry of sorted) {
    const group = entry.data.navGroup;
    if (!navMap.has(group)) {
      navMap.set(group, []);
    }
    navMap.get(group)!.push(entry);
  }

  const navGroups = Array.from(navMap.entries()).map(([id, items]) => {
    return {
      id,
      label: NAV_LABELS[id] ?? id,
      href: buildHref(items[0]?.slug ?? ''),
      pages: items.map((item) => ({
        title: item.data.title,
        slug: item.slug,
        description: item.data.description,
        navGroup: item.data.navGroup,
        href: buildHref(item.slug)
      }))
    };
  });

  const sidebarItems = sorted.map((entry) => ({
    title: entry.data.title,
    slug: entry.slug,
    group: entry.data.sidebarGroup,
    href: buildHref(entry.slug)
  }));

  return { navGroups, sidebarItems, baseHref: homeHref };
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

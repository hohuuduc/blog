import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import lunr from 'lunr';

import { resolveBaseSegment } from '@utils/navigation';
import { languages, type Languages } from '@utils/lang';
import type { SearchDocument, SearchIndexPayload } from '@utils/search';

const EXCERPT_LIMIT = 180;

const AVAILABLE_LANGUAGES: Languages[] = languages;

function createExcerpt(text: string): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return '';
  }
  if (cleaned.length <= EXCERPT_LIMIT) {
    return cleaned;
  }
  return `${cleaned.slice(0, EXCERPT_LIMIT).trim()}…`;
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\(([^)]*)\)/g, '$1')
    .replace(/[#>*_~`]/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildHref(slug: string): string {
  const baseSegment = resolveBaseSegment();
  const prefix = baseSegment ? `/${baseSegment}` : '';
  const normalizedSlug = slug.replace(/^\/+/, '');
  const parts = [prefix.replace(/^\/+/, ''), normalizedSlug].filter(Boolean);
  const joined = parts.join('/');
  if (!joined) {
    return prefix || '/';
  }
  return `/${joined}`;
}

export const prerender = true;

export async function getStaticPaths() {
  return AVAILABLE_LANGUAGES.map((lang) => ({
    params: { lang }
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const langParam = (params.lang ?? '').toLowerCase();
  if (!AVAILABLE_LANGUAGES.includes(langParam as Languages)) {
    return new Response('Not found', { status: 404 });
  }

  const lang = langParam as Languages;
  const entries = await getCollection('blog');
  const filtered = entries.filter((entry) => entry.id.startsWith(`${lang}/`));
  const sorted = filtered.sort((a, b) => {
    const orderA = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.data.title.localeCompare(b.data.title, lang);
  });

  const documentsForIndex = sorted.map((entry) => {
    const plainText = markdownToPlainText(entry.body ?? '');
    const description = entry.data.description ?? '';
    const excerptSource = description || plainText;

    return {
      id: entry.slug,
      title: entry.data.title,
      description,
      href: buildHref(entry.slug),
      excerpt: createExcerpt(excerptSource || plainText),
      body: plainText
    };
  });

  const builder = new lunr.Builder();
  builder.ref('id');
  builder.field('title', { boost: 10 });
  builder.field('description', { boost: 5 });
  builder.field('body');

  builder.pipeline.remove(lunr.stemmer);
  builder.searchPipeline.remove(lunr.stemmer);
  builder.pipeline.remove(lunr.stopWordFilter);
  builder.searchPipeline.remove(lunr.stopWordFilter);

  documentsForIndex.forEach((doc) => {
    builder.add({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      body: doc.body
    });
  });

  const index = builder.build();

  const payload: SearchIndexPayload = {
    lang,
    index: index.toJSON(),
    documents: documentsForIndex.map<SearchDocument>(({ body, ...rest }) => rest)
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
};

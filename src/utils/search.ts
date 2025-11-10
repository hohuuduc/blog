import type { SerializedIndex } from 'lunr';

export interface SearchDocument {
  id: string;
  title: string;
  description: string;
  href: string;
  excerpt: string;
}

export interface SearchIndexPayload {
  lang: string;
  index: SerializedIndex;
  documents: SearchDocument[];
}

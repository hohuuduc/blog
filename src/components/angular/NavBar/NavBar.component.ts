import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, signal } from '@angular/core';
import type { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import lunr from 'lunr';
import BaseComponent from '../Base.component';
import type { NavItem } from '../types';
import type { SearchDocument, SearchIndexPayload } from '@utils/search';
import type { Languages } from '@utils/lang';

const MAX_RESULTS = 8;

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NavBar.component.html',
  styleUrls: ['./NavBar.component.css']
})
export class NavBarComponent extends BaseComponent implements OnChanges, OnDestroy {
  @Input() baseHref = '/';
  @Input() navItems: NavItem[] = [];

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  private scrolledState = signal(false);
  private searchIndex: lunr.Index | null = null;
  private searchDocuments = new Map<string, SearchDocument>();
  private searchIndexPromise: Promise<void> | null = null;
  private blurTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentIndexLang: Languages | null = null;
  private readonly windowScrollHandler = () => {
    if (typeof window === 'undefined') {
      return;
    }
    this.scrolledState.set(window.scrollY > 12);
  };
  private isDestroyed = false;

  readonly searchQuery = signal('');
  readonly searchResults = signal<SearchDocument[]>([]);
  readonly isLoadingSearch = signal(false);
  readonly showSearchPanel = signal(false);
  readonly hasSearchError = signal(false);
  readonly searchInputId = `nav-search-${Math.random().toString(36).slice(2, 10)}`;

  constructor() {
    super();
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.windowScrollHandler, { passive: true });
      this.scrolledState.set(window.scrollY > 12);
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    const langChanged = 'lang' in changes && !changes['lang']?.firstChange;
    const baseHrefChanged = 'baseHref' in changes && !changes['baseHref']?.firstChange;

    if (langChanged || baseHrefChanged) {
      this.resetSearchIndexCache();
      if (this.searchQuery().trim()) {
        void this.ensureSearchIndexLoaded().catch((error) => {
          console.error(error);
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.clearBlurTimeout();
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.windowScrollHandler);
    }
  }

  getNavItems() {
    return this.navItems.map((item) => ({
      label: this.getString(item.label),
      href: item.href,
      pages: item.pages
    }));
  }

  scrolled() {
    return this.scrolledState();
  }

  openSettings(): void {
    document.dispatchEvent(new CustomEvent('open-settings-dialog'));
  }

  async onSearchInput(event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    const trimmed = value.trim();

    if (!trimmed) {
      this.searchResults.set([]);
      this.showSearchPanel.set(false);
      return;
    }

    this.showSearchPanel.set(true);

    try {
      await this.ensureSearchIndexLoaded();
    } catch (error) {
      console.error(error);
      return;
    }

    if (!this.searchIndex) {
      return;
    }

    const tokens = trimmed.split(/\s+/u).filter(Boolean);
    const wildcardQuery = tokens.map((token) => `${token}*`).join(' ');

    try {
      const query = wildcardQuery || trimmed;
      const results = this.searchIndex.search(query);
      const mapped = results
        .map((result) => this.searchDocuments.get(result.ref))
        .filter((doc): doc is SearchDocument => Boolean(doc))
        .slice(0, MAX_RESULTS);
      this.searchResults.set(mapped);
    } catch (error) {
      console.error(error);
      this.searchResults.set([]);
    }
  }

  onSearchFocus(): void {
    this.clearBlurTimeout();
    if (this.searchQuery().trim()) {
      this.showSearchPanel.set(true);
    }
    void this.ensureSearchIndexLoaded().catch((error) => {
      console.error(error);
    });
  }

  onSearchBlur(): void {
    this.blurTimeout = setTimeout(() => {
      this.showSearchPanel.set(false);
    }, 150);
  }

  onSearchPointerDown(): void {
    this.clearBlurTimeout();
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
      this.searchInput?.nativeElement.blur();
    }
  }

  onSearchResultSelected(): void {
    this.clearBlurTimeout();
    this.showSearchPanel.set(false);
    this.searchInput?.nativeElement.blur();
  }

  clearSearch(): void {
    this.clearBlurTimeout();
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showSearchPanel.set(false);
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
  }

  private getSearchIndexUrl(lang: Languages): string {
    const base = this.baseHref?.trim() ?? '';
    const normalizedBase = !base || base === '/' ? '' : base.replace(/\/+$/u, '');
    const sanitizedBase = normalizedBase.replace(/^\/+/, '');
    const segments = [sanitizedBase, lang, 'search-index.json'].filter(Boolean);
    const joined = segments.join('/');
    return `/${joined}`;
  }

  private clearBlurTimeout(): void {
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = null;
    }
  }

  private ensureSearchIndexLoaded(): Promise<void> {
    if (this.isDestroyed || typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (this.searchIndex && this.currentIndexLang === this.lang) {
      return Promise.resolve();
    }

    if (this.searchIndexPromise) {
      return this.searchIndexPromise;
    }

    this.isLoadingSearch.set(true);
    this.hasSearchError.set(false);

    const requestLang = this.lang;
    const indexUrl = this.getSearchIndexUrl(requestLang);

    const loadPromise = (async () => {
      try {
        const response = await fetch(indexUrl, {
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`);
        }
        const payload = (await response.json()) as SearchIndexPayload;
        if (this.isDestroyed || payload.lang !== requestLang) {
          return;
        }
        this.searchIndex = lunr.Index.load(payload.index);
        this.searchDocuments = new Map(payload.documents.map((doc) => [doc.id, doc]));
        this.currentIndexLang = requestLang;
      } catch (error) {
        if (!this.isDestroyed && this.lang === requestLang) {
          this.hasSearchError.set(true);
          this.searchIndex = null;
          this.currentIndexLang = null;
        }
        throw error;
      } finally {
        if (!this.isDestroyed && this.lang === requestLang) {
          this.isLoadingSearch.set(false);
        }
      }
    })();

    this.searchIndexPromise = loadPromise;

    loadPromise.finally(() => {
      if (this.searchIndexPromise === loadPromise) {
        this.searchIndexPromise = null;
      }
    });

    return loadPromise;
  }

  private resetSearchIndexCache(): void {
    this.clearBlurTimeout();
    this.searchIndex = null;
    this.currentIndexLang = null;
    this.searchDocuments.clear();
    this.searchIndexPromise = null;
    this.isLoadingSearch.set(false);
    this.hasSearchError.set(false);
    this.searchResults.set([]);
  }
}

export default NavBarComponent;

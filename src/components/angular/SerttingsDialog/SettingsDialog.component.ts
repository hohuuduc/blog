import { CommonModule } from '@angular/common';
import { Component, ElementRef, effect, signal, ViewChild } from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { languages, type Languages } from '@utils/lang';
import BaseComponent from '../Base.component';

type ThemeOption = 'system' | 'light' | 'dark';

@Component({
  selector: 'settings-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'SettingsDialog.component.html',
  styleUrls: ['SettingsDialog.component.css'],
})
export class SettingsDialogComponent extends BaseComponent implements AfterViewInit {
  readonly themeOptions: ThemeOption[] = ['system', 'light', 'dark'];
  readonly languageOptions: Languages[] = languages;
  private readonly themeStorageKey = 'personal-blog-theme';
  private readonly commentsStorageKey = 'personal-blog-comments';
  @ViewChild('dialogRef') private dialogRef?: ElementRef<HTMLDialogElement>;
  opened = signal(false);
  theme = signal<ThemeOption>('system');
  showComments = signal(true);

  constructor() {
    super();
    if (typeof document !== 'undefined') {
      document.addEventListener('open-settings-dialog', () => this.setOpened(true));
    }

    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem(this.themeStorageKey) as ThemeOption | null;
      if (savedTheme && this.themeOptions.includes(savedTheme)) {
        this.theme.set(savedTheme);
      }
      this.applyTheme(this.theme());

      const savedComments = window.localStorage.getItem(this.commentsStorageKey);
      this.showComments.set(savedComments !== 'false');
      this.applyComments(this.showComments());
    }

    effect(() => {
      const current = this.theme();
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.themeStorageKey, current);
      }
      this.applyTheme(current);
    });

    effect(() => {
        const current = this.showComments();
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(this.commentsStorageKey, String(current));
        }
        this.applyComments(current);
    });

    effect(() => {
      if (typeof document === 'undefined') return;
      if (this.showComments() && !document.querySelector('script[src="https://giscus.app/client.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-repo', 'hohuuduc/blog');
        script.setAttribute('data-repo-id', 'R_kgDOQNou3g');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOQNou3s4Cxtsg');
        script.setAttribute('data-mapping', 'og:title');
        script.setAttribute('data-strict', '1');
        script.setAttribute('data-reactions-enabled', '0');
        script.setAttribute('data-emit-metadata', '1');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-lang', this.lang);
        script.setAttribute('data-theme', this.theme() === 'dark' ? 'dark' : 'light');
        script.setAttribute('data-loading', 'lazy');

        document.getElementById('giscus-container')?.appendChild(script);
      }
    });
  }

  ngAfterViewInit() {
    if (this.opened()) {
      this.setOpened(true);
    }
  }

  setOpened(value: boolean) {
    this.opened.set(value);
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) {
      return;
    }

    if (value) {
      if (!dialog.open) {
        dialog.showModal();
      } else {
        dialog.focus();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }

  handleClose() {
    this.opened.set(false);
  }

  changeTheme(option: ThemeOption) {
    this.theme.set(option);
  }

  toggleComments(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showComments.set(target.checked);
  }

  private applyComments(show: boolean) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('giscus-container');
    if (container) {
      container.style.display = show ? '' : 'none';
    }
  }

  private applyTheme(option: ThemeOption) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const theme = option === 'system' ? (prefersDark ? 'dark' : 'light') : option;
    root.dataset.theme = theme;
    const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null;
    if (iframe)
      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: theme,
            },
          },
        },
        'https://giscus.app'
      );
  }

  changeLanguage(lang: Languages, option: Languages) {
    let href = window.location.href;

    switch (option) {
      case 'en':
        href = href.replace(new RegExp(`/${lang}/?`, "g"), "/en/");
        break;
      case 'vi':
        href = href.replace(new RegExp(`/${lang}/?`, "g"), "/vi/");
        break;
    }
    window.location.href = href;
  }
}

export default SettingsDialogComponent;

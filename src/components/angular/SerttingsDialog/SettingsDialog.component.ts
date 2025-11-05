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
  @ViewChild('dialogRef') private dialogRef?: ElementRef<HTMLDialogElement>;
  opened = signal(false);
  theme = signal<ThemeOption>('system');

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
    }

    effect(() => {
      const current = this.theme();
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.themeStorageKey, current);
      }
      this.applyTheme(current);
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

  getThemeLabel(option: ThemeOption) {
    switch (option) {
      case 'system':
        return 'Tự động (theo hệ thống)';
      case 'light':
        return 'Sáng';
      case 'dark':
        return 'Tối';
    }
  }

  private applyTheme(option: ThemeOption) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const theme = option === 'system' ? (prefersDark ? 'dark' : 'light') : option;
    root.dataset.theme = theme;
  }

  changeLanguage(lang: Languages,option: Languages) {
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

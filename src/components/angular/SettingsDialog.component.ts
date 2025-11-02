import { CommonModule } from '@angular/common';
import { Component, ElementRef, effect, signal, ViewChild } from '@angular/core';
import type { AfterViewInit } from '@angular/core';

type ThemeOption = 'system' | 'light' | 'dark';
type LanguageOption = 'vi' | 'en';

@Component({
  selector: 'settings-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog #dialogRef class="settings-dialog" (close)="handleClose()">
      <form method="dialog" class="dialog-content" (submit)="$event.preventDefault()">
        <header>
          <div>
            <h2>Tùy chỉnh hiển thị</h2>
            <p class="subtitle">Điều chỉnh giao diện và ngôn ngữ theo ý bạn.</p>
          </div>
          <button type="button" class="close" (click)="setOpened(false)" aria-label="Đóng">×</button>
        </header>
        <section class="setting-group">
          <div class="group-heading">
            <h3>Giao diện</h3>
            <p>Chọn chế độ sáng, tối hoặc theo hệ thống.</p>
          </div>
          <div class="options-grid">
            <label *ngFor="let option of themeOptions" [class.selected]="theme() === option">
              <input
                type="radio"
                name="theme"
                [value]="option"
                [checked]="theme() === option"
                (change)="changeTheme(option)"
              />
              <span>{{ getThemeLabel(option) }}</span>
            </label>
          </div>
        </section>
        <section class="setting-group">
          <div class="group-heading">
            <h3>Ngôn ngữ</h3>
            <p>Đổi ngôn ngữ hiển thị nội dung trang.</p>
          </div>
          <div class="options-grid">
            <label *ngFor="let option of languageOptions" [class.selected]="language() === option">
              <input
                type="radio"
                name="language"
                [value]="option"
                [checked]="language() === option"
                (change)="changeLanguage(option)"
              />
              <span>{{ getLanguageLabel(option) }}</span>
            </label>
          </div>
        </section>
      </form>
    </dialog>
  `,
  styles: [`
    :host {
      display: contents;
    }
    .settings-dialog::backdrop {
      background: rgba(15, 23, 42, 0.35);
    }
    .settings-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      border: none;
      border-radius: 1rem;
      padding: 0;
      width: min(420px, calc(100vw - 2rem));
      background: var(--surface-elevated);
      color: var(--text-strong);
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.35);
      z-index: 1000;
    }
    .dialog-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }
    header h2 {
      margin: 0;
      font-size: 1.2rem;
    }
    .subtitle {
      margin: 0.35rem 0 0;
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .close {
      border: none;
      background: transparent;
      font-size: 1.8rem;
      line-height: 1;
      cursor: pointer;
      color: var(--text-muted);
    }
    .close:hover,
    .close:focus-visible {
      color: var(--text-strong);
      outline: none;
    }
    .setting-group {
      display: grid;
      gap: 1rem;
    }
    .group-heading h3 {
      margin: 0;
      font-size: 1.05rem;
    }
    .group-heading p {
      margin: 0.35rem 0 0;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .options-grid {
      display: grid;
      gap: 0.75rem;
    }
    label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-radius: 0.75rem;
      background: color-mix(in srgb, var(--surface-color) 80%, transparent);
      border: 1px solid color-mix(in srgb, var(--border-color) 60%, transparent);
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }
    label.selected {
      border-color: color-mix(in srgb, var(--accent-color) 60%, transparent);
      background: color-mix(in srgb, var(--accent-color) 18%, transparent);
    }
    input[type='radio'] {
      accent-color: var(--accent-color);
    }
  `]
})
export class SettingsDialogComponent implements AfterViewInit {
  readonly themeOptions: ThemeOption[] = ['system', 'light', 'dark'];
  readonly languageOptions: LanguageOption[] = ['vi', 'en'];
  private readonly themeStorageKey = 'personal-blog-theme';
  private readonly languageStorageKey = 'personal-blog-language';
  @ViewChild('dialogRef') private dialogRef?: ElementRef<HTMLDialogElement>;
  opened = signal(false);
  theme = signal<ThemeOption>('system');
  language = signal<LanguageOption>('vi');

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('open-settings-dialog', () => this.setOpened(true));
    }

    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem(this.themeStorageKey) as ThemeOption | null;
      if (savedTheme && this.themeOptions.includes(savedTheme)) {
        this.theme.set(savedTheme);
      }
      const savedLanguage = window.localStorage.getItem(this.languageStorageKey) as LanguageOption | null;
      if (savedLanguage && this.languageOptions.includes(savedLanguage)) {
        this.language.set(savedLanguage);
      }
      this.applyTheme(this.theme());
      this.applyLanguage(this.language());
    }

    effect(() => {
      const current = this.theme();
      const currentLanguage = this.language();
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.themeStorageKey, current);
        window.localStorage.setItem(this.languageStorageKey, currentLanguage);
      }
      this.applyTheme(current);
      this.applyLanguage(currentLanguage);
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

  changeLanguage(option: LanguageOption) {
    this.language.set(option);
  }

  getLanguageLabel(option: LanguageOption) {
    switch (option) {
      case 'vi':
        return 'Tiếng Việt';
      case 'en':
        return 'English';
    }
  }

  private applyTheme(option: ThemeOption) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const theme = option === 'system' ? (prefersDark ? 'dark' : 'light') : option;
    root.dataset.theme = theme;
  }

  private applyLanguage(option: LanguageOption) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.lang = option;
    root.dataset.language = option;
  }
}

export default SettingsDialogComponent;

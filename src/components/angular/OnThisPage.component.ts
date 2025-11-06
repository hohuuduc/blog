import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { HeadingLink } from './types';

@Component({
  selector: 'on-this-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="on-this-page" id="on-this-page-drawer">
      <h2>On this page</h2>
      <nav *ngIf="headings?.length; else empty">
        <a *ngFor="let heading of headings" class="heading-link" [style.--depth]="heading.depth" [href]="'#' + heading.slug">
          {{ heading.text }}
        </a>
      </nav>
      <ng-template #empty>
        <p>Không có mục lục cho trang này.</p>
      </ng-template>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }
    .on-this-page {
      position: sticky;
      top: 4.5rem;
      padding: 1rem;
      max-height: calc(100vh - 5rem);
      overflow-y: auto;
      font-size: 0.85rem;
      color: var(--text-muted);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    h2 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.75rem;
      color: var(--text-subtle);
    }
    .heading-link {
      display: block;
      text-decoration: none;
      color: var(--text-muted);
      padding: 0.25rem 0.4rem;
      border-radius: 0.35rem;
      margin-left: calc((var(--depth) - 2) * 0.75rem);
    }
    .heading-link:hover {
      background: color-mix(in srgb, var(--accent-color) 18%, transparent);
      color: var(--text-strong);
    }
    @media (max-width: 1200px) {
      .on-this-page {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        max-height: none;
        width: min(20rem, 85vw);
        background: var(--surface-elevated);
        box-shadow: -20px 0 45px rgba(15, 23, 42, 0.25);
        padding: 4.75rem 1.5rem 2rem;
        overflow-y: auto;
        transform: translateX(100%);
        opacity: 0;
        pointer-events: none;
        z-index: 1100;
      }
      body.toc-open on-this-page .on-this-page {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }
    }
  `]
})
export class OnThisPageComponent {
  @Input({ required: true }) headings: HeadingLink[] = [];
}

export default OnThisPageComponent;

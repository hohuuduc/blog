import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { HeadingLink } from './types';

@Component({
  selector: 'on-this-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="on-this-page">
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
        display: none;
      }
    }
  `]
})
export class OnThisPageComponent {
  @Input({ required: true }) headings: HeadingLink[] = [];
}

export default OnThisPageComponent;

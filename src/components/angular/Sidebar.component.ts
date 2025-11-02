import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { SidebarItem } from './types';

@Component({
  selector: 'sidebar-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <h2>Toàn bộ trang</h2>
      <nav>
        <ng-container *ngFor="let group of groupedItems">
          <div class="sidebar-group" *ngIf="group.label">
            <div class="sidebar-group-label">{{ group.label }}</div>
            <a *ngFor="let item of group.items" class="sidebar-link" [class.active]="item.slug === currentSlug" [href]="item.href">
              {{ item.title }}
            </a>
          </div>
          <ng-container *ngIf="!group.label">
            <a *ngFor="let item of group.items" class="sidebar-link" [class.active]="item.slug === currentSlug" [href]="item.href">
              {{ item.title }}
            </a>
          </ng-container>
        </ng-container>
      </nav>
    </aside>
  `,
  styles: [`
    :host {
      display: contents;
    }
    .sidebar {
      position: sticky;
      top: 4.5rem;
      padding: 1rem 1rem 2rem;
      max-height: calc(100vh - 5rem);
      overflow-y: auto;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    h2 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 0.75rem;
      color: var(--text-subtle);
    }
    .sidebar-group + .sidebar-group {
      margin-top: 1rem;
    }
    .sidebar-group-label {
      font-weight: 600;
      color: var(--text-subtle);
      margin-bottom: 0.4rem;
    }
    .sidebar-link {
      display: block;
      color: var(--text-muted);
      text-decoration: none;
      padding: 0.3rem 0.4rem;
      border-radius: 0.5rem;
    }
    .sidebar-link.active {
      color: var(--text-strong);
      background: color-mix(in srgb, var(--accent-color) 18%, transparent);
      font-weight: 600;
    }
    .sidebar-link:hover {
      color: var(--text-strong);
    }
    @media (max-width: 1024px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  @Input({ required: true }) items: SidebarItem[] = [];
  @Input({ required: true }) currentSlug = '';

  get groupedItems() {
    const groups = new Map<string, SidebarItem[]>();
    for (const item of this.items) {
      const key = item.group ?? '';
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries()).map(([label, groupItems]) => ({
      label,
      items: groupItems
    }));
  }
}

export default SidebarComponent;

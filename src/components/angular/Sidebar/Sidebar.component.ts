import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { SidebarItem } from '../types';

@Component({
  selector: 'sidebar-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'Sidebar.component.html',
  styleUrls: ['Sidebar.component.css']
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

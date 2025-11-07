import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { OnChanges, SimpleChanges } from '@angular/core';
import type { SidebarItem, SidebarTreeNode } from '../types';
import BaseComponent from '../Base.component';
import type { Languages } from '@utils/lang';

@Component({
  selector: 'sidebar-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'Sidebar.component.html',
  styleUrls: ['Sidebar.component.css']
})
export class SidebarComponent extends BaseComponent implements OnChanges {
  @Input({ required: true }) items: SidebarItem[] = [];
  @Input({ required: true }) currentSlug = '';

  nodes: SidebarTreeNode[] = [];
  private expandedNodes = new Set<string>();

  ngOnChanges(_: SimpleChanges): void {
    this.nodes = this.buildTreeForGroup(this.items, this.lang);
    this.syncExpandedNodes();
  }

  isExpanded(id: string): boolean {
    return this.expandedNodes.has(id);
  }

  toggleNode(id: string): void {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }
  }

  getToggleLabel(node: SidebarTreeNode): string {
    const action = this.isExpanded(node.id) ? 'Thu gọn' : 'Mở rộng';
    return `${action} ${node.label}`;
  }

  private buildTreeForGroup(items: SidebarItem[], lang: Languages): SidebarTreeNode[] {
    const tree: SidebarTreeNode[] = [];
    for (const item of items) {
      const pathSegments = item.slug.split('/').slice(1);
      this.insertTreeNode(tree, pathSegments, item);
    }
    return tree;
  }

  private insertTreeNode(nodes: SidebarTreeNode[], segments: string[], item: SidebarItem, prefix = ''): void {
    if (segments.length <= 1) {
      nodes.push({
        id: item.slug,
        label: item.title,
        href: item.href,
        slug: item.slug
      });
      return;
    }

    const [current, ...rest] = segments;
    const nodeId = prefix ? `${prefix}/${current}` : current;
    let node = nodes.find((child) => child.id === nodeId && !child.href);
    if (!node) {
      node = {
        id: nodeId,
        label: this.formatSegment(current),
        children: []
      };
      nodes.push(node);
    }
    if (!node.children) {
      node.children = [];
    }
    this.insertTreeNode(node.children, rest, item, nodeId);
  }

  private formatSegment(segment: string): string {
    return segment
      .split(/[-_]/g)
      .filter(Boolean)
      .map((part) => this.humanizeSegmentPart(part))
      .join(' ');
  }

  private humanizeSegmentPart(part: string): string {
    const trimmed = part.trim();
    if (!trimmed) {
      return '';
    }

    const lower = trimmed.toLowerCase();
    if (/^[a-z]+$/.test(lower)) {
      if (lower.length <= 3) {
        return lower.toUpperCase();
      }
      if (lower.endsWith('s') && lower.slice(0, -1).length <= 3) {
        return `${lower.slice(0, -1).toUpperCase()}s`;
      }
    }

    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  private syncExpandedNodes(): void {
    const available = new Set<string>();
    this.collectDirectoryIds(this.nodes, available);
    for (const node of this.nodes) {
      if (node.children?.length) {
        this.expandedNodes.add(node.id);
      }
    }
    const slugSegments = this.currentSlug.split('/');
    const directorySegments = slugSegments.slice(this.lang ? 1 : 0, slugSegments.length - 1);
    let currentPath = '';
    for (const segment of directorySegments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      if (available.has(currentPath)) {
        this.expandedNodes.add(currentPath);
      }
    }

    for (const id of Array.from(this.expandedNodes)) {
      if (!available.has(id)) {
        this.expandedNodes.delete(id);
      }
    }
  }

  private collectDirectoryIds(nodes: SidebarTreeNode[], acc: Set<string>): void {
    for (const node of nodes) {
      if (node.children?.length) {
        acc.add(node.id);
        this.collectDirectoryIds(node.children, acc);
      }
    }
  }
}

export default SidebarComponent;
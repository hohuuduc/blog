import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import type { NavGroup } from '../types';
import { resolveBaseSegment } from 'src/utils/navigation';
import { strings } from 'src/utils/lang';

const MENU = [
  {
    label: 'nav.docs',
    href: `${resolveBaseSegment()}/`,
    pages: []
  },
  {
    label: 'nav.about',
    href: '/about',
    pages: []
  },
  {
    label: 'nav.products',
    pages: [
      {
        title: 'Product 1',
        href: '/products/product-1'
      },
      {
        title: 'Product 2',
        href: '/products/product-2'
      }
    ]
  }
] as NavGroup[];

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NavBar.component.html',
  styleUrls: ['./NavBar.component.css']
})
export class NavBarComponent {
  @Input() baseHref = '/';
  @Input() lang: keyof typeof strings = 'vi';

  private scrolledState = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolledState.set(window.scrollY > 12);
      });
    }
  }

  getNavItems() {
    return MENU.map(i => ({
      label: strings[this.lang][i.label],
      href: i.href,
      pages: i.pages
    }));
  }

  scrolled() {
    return this.scrolledState();
  }

  openSettings(): void {
    console.log("debug")
  }
}

export default NavBarComponent;

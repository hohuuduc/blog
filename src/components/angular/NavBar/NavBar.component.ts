import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import type { NavItem } from '../types';
import BaseComponent from '../Base.component';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './NavBar.component.html',
  styleUrls: ['./NavBar.component.css']
})
export class NavBarComponent extends BaseComponent {
  @Input() baseHref = '/';
  @Input() navItems: NavItem[] = [];

  private scrolledState = signal(false);

  constructor() {
    super();
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolledState.set(window.scrollY > 12);
      });
    }
  }

  getNavItems() {
    return this.navItems.map(i => ({
      label: this.getString(i.label),
      href: i.href,
      pages: i.pages
    }));
  }

  scrolled() {
    return this.scrolledState();
  }

  openSettings(): void {
    document.dispatchEvent(new CustomEvent('open-settings-dialog'));
  }
}

export default NavBarComponent;

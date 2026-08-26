import { Component, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';

interface NavItem {
  label: string;
  icon: string;
  link?: string;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, DrawerModule, NgTemplateOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  /** Controls the mobile overlay drawer only — the desktop sidebar is always static. */
  readonly mobileOpen = model(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', link: '/dashboard' },
    { label: 'Kullanıcılar', icon: 'pi pi-users', link: '/dashboard/users' },
    { label: 'Ayarlar', icon: 'pi pi-cog', comingSoon: true },
  ];
}

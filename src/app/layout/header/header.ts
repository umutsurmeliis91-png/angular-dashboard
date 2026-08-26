import { Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { filter, map, startWith } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, MenuModule, PopoverModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly menuToggle = output<void>();

  readonly currentUser = this.authService.currentUser;

  /** Deepest activated route's `title` (set per-route in app.routes.ts), e.g. "Dashboard" / "Kullanıcılar". */
  readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.resolvePageTitle()),
      startWith(this.resolvePageTitle()),
    ),
    { initialValue: 'Dashboard' },
  );

  readonly initials = computed(() => {
    const name = this.currentUser()?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  readonly userMenuItems: MenuItem[] = [
    { label: 'Profil', icon: 'pi pi-user' },
    { label: 'Ayarlar', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Çıkış Yap', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  private logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  private resolvePageTitle(): string {
    let route = this.activatedRoute.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot?.title ?? 'Dashboard';
  }
}

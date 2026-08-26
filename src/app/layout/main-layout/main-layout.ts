import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  readonly sidebarMobileOpen = signal(false);
}

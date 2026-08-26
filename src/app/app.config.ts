import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

/** Indigo primary palette, matching the design spec's "Primary: Indigo / Blue". */
const AppTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      ripple: true,
      theme: {
        preset: AppTheme,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'reset, primeng',
          },
        },
      },
    }),
  ],
};

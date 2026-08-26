import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { AuthResponse, LoginCredentials, User } from './auth.models';

/** Centralized localStorage keys — nothing outside this file should hardcode them. */
export const AUTH_STORAGE_KEYS = {
  AUTH: 'app_auth',
  USER: 'app_user',
} as const;

/**
 * Mock demo account. This whole block is what gets replaced by a real
 * `POST {environment.apiUrl}/auth/login` call once the Spring Boot backend
 * exists — `login()` is the only method that needs to change, everything
 * else (signals, guard, interceptor, components) stays as-is.
 */
const DEMO_CREDENTIALS = { username: 'admin', password: 'admin123' };
const DEMO_USER: User = {
  id: 1,
  username: 'admin',
  name: 'Admin User',
  email: 'admin@example.com',
  roles: ['ADMIN'],
};
const MOCK_TOKEN = 'mock-jwt-token';
const MOCK_LATENCY_MS = 600;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);

  /** Restored synchronously so a page refresh never flashes the login screen. */
  readonly currentUser = signal<User | null>(this.storage.get<User>(AUTH_STORAGE_KEYS.USER));
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const isValid =
      credentials.username === DEMO_CREDENTIALS.username &&
      credentials.password === DEMO_CREDENTIALS.password;

    if (!isValid) {
      return throwError(() => new Error('Kullanıcı adı veya şifre hatalı.')).pipe(
        delay(MOCK_LATENCY_MS),
      );
    }

    const response: AuthResponse = { token: MOCK_TOKEN, user: DEMO_USER };

    return of(response).pipe(
      delay(MOCK_LATENCY_MS),
      tap((res) => this.persistSession(res)),
    );
  }

  logout(): void {
    this.storage.remove(AUTH_STORAGE_KEYS.AUTH);
    this.storage.remove(AUTH_STORAGE_KEYS.USER);
    this.currentUser.set(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  token(): string | null {
    return this.storage.get<string>(AUTH_STORAGE_KEYS.AUTH);
  }

  private persistSession(response: AuthResponse): void {
    this.storage.set(AUTH_STORAGE_KEYS.AUTH, response.token);
    this.storage.set(AUTH_STORAGE_KEYS.USER, response.user);
    this.currentUser.set(response.user);
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { AuthResponse, LoginCredentials, User } from './auth.models';

/** Centralized localStorage keys — nothing outside this file should hardcode them. */
export const AUTH_STORAGE_KEYS = {
  AUTH: 'app_auth',
  USER: 'app_user',
} as const;

@Injectable({ providedIn: 'root' }) //Angular'a bu servisin uygulamanın root seviyesinde tek bir instance (singleton) olarak oluşturulacağını söylemek demektir.
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  /** Restored synchronously so a page refresh never flashes the login screen. */
  readonly currentUser = signal<User | null>(this.storage.get<User>(AUTH_STORAGE_KEYS.USER));
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => this.persistSession(response)),
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 401
            ? 'Kullanıcı adı veya şifre hatalı.'
            : 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.';
        return throwError(() => new Error(message));
      }),
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

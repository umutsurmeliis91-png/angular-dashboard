import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../core/auth/auth.models';
import { UserFormValue } from '../../shared/models/user.models';

/** Turns a failed create/update call into the friendly `Error` the Users component expects. */
function toFriendlyError(error: HttpErrorResponse): Observable<never> {
  const backendMessage = (error.error as { message?: string } | null)?.message;
  return throwError(() => new Error(backendMessage ?? 'İşlem sırasında bir hata oluştu.'));
}

/**
 * Talks to the Spring Boot `/api/users` endpoints. `users` mirrors the last
 * server response so components can read the list reactively after a
 * mutation without re-fetching it.
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  private readonly usersStore = signal<User[]>([]);

  /** Always in sync with the store — components can read this directly after a mutation. */
  readonly users = this.usersStore.asReadonly();

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(tap((users) => this.usersStore.set(users)));
  }

  createUser(input: UserFormValue): Observable<User> {
    return this.http.post<User>(this.apiUrl, input).pipe(
      tap((user) => this.usersStore.update((users) => [...users, user])),
      catchError(toFriendlyError),
    );
  }

  updateUser(id: number, input: UserFormValue): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, input).pipe(
      tap((updated) =>
        this.usersStore.update((users) => users.map((user) => (user.id === id ? updated : user))),
      ),
      catchError(toFriendlyError),
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.usersStore.update((users) => users.filter((user) => user.id !== id))));
  }
}

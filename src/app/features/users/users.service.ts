import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../core/auth/auth.models';
import { UserFormValue } from '../../shared/models/user.models';

const MOCK_LATENCY_MS = 400;

const INITIAL_USERS: User[] = [
  { id: 1, username: 'admin', name: 'Admin User', email: 'admin@example.com', roles: ['ADMIN'] },
  { id: 2, username: 'jdoe', name: 'John Doe', email: 'john.doe@example.com', roles: ['EDITOR'] },
  { id: 3, username: 'jsmith', name: 'Jane Smith', email: 'jane.smith@example.com', roles: ['USER'] },
  { id: 4, username: 'mlee', name: 'Michael Lee', email: 'michael.lee@example.com', roles: ['USER'] },
];

/**
 * In-memory mock CRUD store for user management. All methods already return
 * `Observable`s so swapping to a real Spring Boot API later only means
 * replacing each method body with an `HttpClient` call
 * (`GET/POST/PUT/DELETE {environment.apiUrl}/users`) — the component never
 * needs to change.
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly usersStore = signal<User[]>(INITIAL_USERS);
  private nextId = INITIAL_USERS.length + 1;

  /** Always in sync with the store — components can read this directly after a mutation. */
  readonly users = this.usersStore.asReadonly();

  getUsers(): Observable<User[]> {
    return of(this.usersStore()).pipe(delay(MOCK_LATENCY_MS));
  }

  createUser(input: UserFormValue): Observable<User> {
    const user: User = {
      id: this.nextId++,
      username: input.username,
      name: input.name,
      email: input.email,
      roles: [input.role],
    };

    return of(user).pipe(
      delay(MOCK_LATENCY_MS),
      tap(() => this.usersStore.update((users) => [...users, user])),
    );
  }

  updateUser(id: number, input: UserFormValue): Observable<User> {
    const existing = this.usersStore().find((user) => user.id === id);
    if (!existing) {
      return throwError(() => new Error('Kullanıcı bulunamadı.')).pipe(delay(MOCK_LATENCY_MS));
    }

    const updated: User = {
      ...existing,
      username: input.username,
      name: input.name,
      email: input.email,
      roles: [input.role],
    };

    return of(updated).pipe(
      delay(MOCK_LATENCY_MS),
      tap(() => this.usersStore.update((users) => users.map((u) => (u.id === id ? updated : u)))),
    );
  }

  deleteUser(id: number): Observable<void> {
    return of(undefined).pipe(
      delay(MOCK_LATENCY_MS),
      tap(() => this.usersStore.update((users) => users.filter((u) => u.id !== id))),
    );
  }
}

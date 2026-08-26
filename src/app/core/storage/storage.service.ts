import { Injectable } from '@angular/core';

/**
 * Thin wrapper around `localStorage` so no other part of the app touches the
 * browser storage API or does JSON (de)serialization directly.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

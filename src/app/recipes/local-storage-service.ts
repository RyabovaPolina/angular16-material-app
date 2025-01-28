import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  // Метод для сохранения данных в localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Метод для получения данных из localStorage
  getItem<T>(key: string): T | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : null;
    }
    return null;
  }

  // Метод для удаления данных из localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Метод для очистки всех данных в localStorage
  clear(): void {
    localStorage.clear();
  }
}

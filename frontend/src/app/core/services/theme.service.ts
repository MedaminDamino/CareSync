import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'caresync-theme-dark';
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initTheme();
  }

  private initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      let prefersDark = false;

      if (savedTheme !== null) {
        prefersDark = savedTheme === 'true';
      } else {
        prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      this.isDarkModeSubject.next(prefersDark);
      this.applyTheme(prefersDark);
    }
  }

  public toggleTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const newTheme = !this.isDarkModeSubject.value;
      this.isDarkModeSubject.next(newTheme);
      localStorage.setItem(this.THEME_KEY, String(newTheme));
      this.applyTheme(newTheme);
    }
  }

  private applyTheme(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      if (isDark) {
        htmlElement.classList.add('p-dark');
      } else {
        htmlElement.classList.remove('p-dark');
      }
    }
  }
}

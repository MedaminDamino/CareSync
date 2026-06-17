import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  templateUrl: './theme-toggle.component.html',
  styles: []
})
export class ThemeToggleComponent {
  isDark = false;

  constructor(public themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(dark => this.isDark = dark);
  }

  toggle(): void {
    this.themeService.toggleTheme();
  }
}

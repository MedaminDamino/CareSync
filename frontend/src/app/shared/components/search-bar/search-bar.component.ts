import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedPrimeNgModule],
  template: `
    <div class="search-bar-container">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search search-icon text-muted"></i>
        <input 
          type="text" 
          pInputText 
          [placeholder]="placeholder" 
          [(ngModel)]="searchValue" 
          (ngModelChange)="onSearchChange($event)"
          class="w-full search-input"
        />
      </span>
    </div>
  `,
  styles: [`
    .search-bar-container {
      width: 100%;
    }
    .search-input {
      padding-left: 2.5rem !important;
      border-radius: var(--radius-md) !important;
      font-size: 14px !important;
    }
    .search-icon {
      left: 0.85rem !important;
      margin-top: -8px !important;
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Search...';
  @Input() searchValue = '';
  @Output() search = new EventEmitter<string>();

  onSearchChange(value: string): void {
    this.search.emit(value);
  }
}

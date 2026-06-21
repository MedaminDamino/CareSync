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
      <p-iconfield class="w-full">
        <p-inputicon class="pi pi-search text-muted"></p-inputicon>
        <input 
          type="text" 
          pInputText 
          [placeholder]="placeholder" 
          [(ngModel)]="searchValue" 
          (ngModelChange)="onSearchChange($event)"
          class="w-full search-input"
        />
      </p-iconfield>
    </div>
  `,
  styles: [`
    .search-bar-container {
      width: 100%;
    }
    .search-input {
      border-radius: var(--radius-md) !important;
      font-size: 14px !important;
      padding-left: 2.5rem !important;
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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedPrimeNgModule],
  template: `
    <div class="filter-bar-container">
      <p-select 
        [options]="options" 
        [optionLabel]="optionLabel" 
        [optionValue]="optionValue" 
        [placeholder]="placeholder" 
        [(ngModel)]="filterValue" 
        (onChange)="onFilterChange($event.value)" 
        [showClear]="showClear" 
        styleClass="w-full filter-select"
      ></p-select>
    </div>
  `,
  styles: [`
    .filter-bar-container {
      width: 100%;
      min-width: 180px;
    }
    ::ng-deep .filter-select {
      border-radius: var(--radius-md) !important;
      font-size: 14px !important;
    }
  `]
})
export class FilterBarComponent {
  @Input() options: any[] = [];
  @Input() optionLabel = 'name';
  @Input() optionValue = 'id';
  @Input() placeholder = 'Filter...';
  @Input() filterValue: any = null;
  @Input() showClear = true;
  @Output() filter = new EventEmitter<any>();

  onFilterChange(value: any): void {
    this.filter.emit(value);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-header-wrapper">
      <div class="dialog-header-left">
        <div class="dialog-header-icon-container" *ngIf="icon">
          <i [class]="'pi ' + icon + ' dialog-header-icon'"></i>
        </div>
        <div class="dialog-header-titles">
          <h3 class="dialog-title font-outfit">{{ title }}</h3>
          <p class="dialog-subtitle font-inter" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <button *ngIf="showClose" class="dialog-close-btn" (click)="close.emit()" aria-label="Close dialog">
        <i class="pi pi-times"></i>
      </button>
    </div>
  `,
  styles: [`
    .dialog-header-wrapper {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      width: 100%;
      padding: 32px 32px 24px;
      border-bottom: 1px solid var(--border-color);
      background: var(--card-bg);
      box-sizing: border-box;
    }
    .dialog-header-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .dialog-header-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--primary-light);
      color: var(--primary-color);
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
      transition: all 0.2s ease;
    }
    .p-dark .dialog-header-icon-container {
      background: rgba(37, 99, 235, 0.15);
      color: #60a5fa;
    }
    .dialog-header-icon {
      font-size: 1.25rem;
    }
    .dialog-header-titles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .dialog-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0;
      line-height: 1.2;
    }
    .dialog-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.4;
    }
    .dialog-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .dialog-close-btn:hover {
      background: var(--border-light);
      color: var(--text-main);
      border-color: var(--border-color);
    }
    .dialog-close-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `]
})
export class DialogHeaderComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showClose = true;
  @Output() close = new EventEmitter<void>();
}

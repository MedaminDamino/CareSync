import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../primeng.module';

/**
 * Reusable PrimeNG-based confirm dialog.
 * Usage: use ConfirmationService (from primeng/api) directly for most cases.
 * This component is kept for custom inline dialogs.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="title || 'Confirm Action'"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '420px' }"
      (onHide)="onCancel()">

      <div class="confirm-body">
        <i class="pi pi-exclamation-triangle confirm-icon"></i>
        <p class="confirm-message">{{ message || 'Are you sure you want to proceed?' }}</p>
      </div>

      <ng-template pTemplate="footer">
        <div class="confirm-actions">
          <p-button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            [outlined]="true"
            (onClick)="onCancel()">
          </p-button>
          <p-button
            label="Confirm"
            icon="pi pi-check"
            severity="danger"
            (onClick)="onConfirm()">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .confirm-body {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 8px 4px 16px;
    }

    .confirm-icon {
      font-size: 2rem;
      color: #f59e0b;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .confirm-message {
      font-size: 0.95rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }

    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancelled.emit();
  }

  onConfirm(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.confirmed.emit();
  }
}

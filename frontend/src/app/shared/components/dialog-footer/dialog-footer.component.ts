import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  template: `
    <div class="dialog-footer-wrapper">
      <div class="dialog-footer-left">
        <ng-content select="[left]"></ng-content>
      </div>
      <div class="dialog-footer-right">
        <p-button
          *ngIf="showCancel"
          [label]="cancelLabel"
          [icon]="cancelIcon"
          [outlined]="true"
          severity="secondary"
          (onClick)="cancel.emit()"
          styleClass="dialog-footer-btn-secondary">
        </p-button>
        <p-button
          *ngIf="showSubmit"
          [label]="submitLabel"
          [icon]="submitIcon"
          [severity]="submitSeverity"
          [disabled]="submitDisabled"
          [loading]="submitLoading"
          (onClick)="submit.emit()"
          styleClass="dialog-footer-btn-primary">
        </p-button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .dialog-footer-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 20px 32px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-main);
      box-sizing: border-box;
    }
    .dialog-footer-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dialog-footer-right {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }
    ::ng-deep .dialog-footer-btn-secondary.p-button {
      background: transparent !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-muted) !important;
      padding: 10px 18px !important;
      font-weight: 500 !important;
    }
    ::ng-deep .dialog-footer-btn-secondary.p-button:hover {
      background: var(--border-light) !important;
      color: var(--text-main) !important;
      border-color: var(--border-color) !important;
    }
    ::ng-deep .dialog-footer-btn-primary.p-button {
      padding: 10px 20px !important;
      font-weight: 600 !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    }
  `]
})
export class DialogFooterComponent {
  @Input() showCancel = true;
  @Input() cancelLabel = 'Cancel';
  @Input() cancelIcon = 'pi pi-times';
  
  @Input() showSubmit = true;
  @Input() submitLabel = 'Confirm';
  @Input() submitIcon = 'pi pi-check';
  @Input() submitSeverity: 'primary' | 'success' | 'info' | 'warn' | 'danger' | 'secondary' = 'primary';
  @Input() submitDisabled = false;
  @Input() submitLoading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}

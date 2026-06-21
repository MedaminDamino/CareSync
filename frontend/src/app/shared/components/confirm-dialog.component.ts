import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../primeng.module';
import { DialogShellComponent } from './dialog-shell/dialog-shell.component';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { DialogFooterComponent } from './dialog-footer/dialog-footer.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule, DialogShellComponent, DialogBodyComponent, DialogFooterComponent],
  template: `
    <app-dialog-shell
      [visible]="visible"
      [title]="title"
      subtitle="Please confirm your selection below."
      icon="pi-exclamation-triangle"
      width="sm"
      (close)="onCancel()">

      <app-dialog-body>
        <div class="confirm-body">
          <p class="confirm-message">{{ message }}</p>
        </div>
      </app-dialog-body>

      <app-dialog-footer
        cancelLabel="Cancel"
        submitLabel="Confirm"
        submitSeverity="danger"
        submitIcon="pi pi-check"
        (cancel)="onCancel()"
        (submit)="onConfirm()">
      </app-dialog-footer>

    </app-dialog-shell>
  `,
  styles: [`
    .confirm-body {
      padding: 8px 4px 16px;
    }

    .confirm-message {
      font-size: 0.95rem;
      color: var(--text-main);
      line-height: 1.6;
      margin: 0;
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

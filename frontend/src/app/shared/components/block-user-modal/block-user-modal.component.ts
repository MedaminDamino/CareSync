import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedPrimeNgModule } from '../../primeng.module';
import { DialogShellComponent } from '../dialog-shell/dialog-shell.component';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component';

export interface BlockConfirmEvent {
  reason: string;
  notes: string;
}

@Component({
  selector: 'app-block-user-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    SharedPrimeNgModule, 
    DialogShellComponent, 
    DialogBodyComponent, 
    DialogFooterComponent
  ],
  template: `
    <app-dialog-shell
      [visible]="visible"
      title="Block User Account"
      [subtitle]="'You are about to block ' + (targetName || 'this user') + '. They will not be able to log in.'"
      icon="pi-ban"
      width="sm"
      (close)="onCancel()">

      <app-dialog-body>
        <form [formGroup]="blockForm" class="flex flex-column gap-4">

          <!-- Reason Field -->
          <div class="form-field">
            <label for="blockReason" class="field-label">
              Block Reason <span class="required-mark">*</span>
            </label>
            <p class="field-desc">Select the primary reason for blocking this account.</p>
            <p-select
              id="blockReason"
              [options]="reasonOptions"
              formControlName="reason"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a reason..."
              styleClass="w-full">
            </p-select>
            <small class="p-error" *ngIf="blockForm.get('reason')?.touched && blockForm.get('reason')?.hasError('required')">
              A reason is required.
            </small>
          </div>

          <!-- Notes Field -->
          <div class="form-field">
            <label for="blockNotes" class="field-label">Additional Notes</label>
            <p class="field-desc">Optional. Provide any additional context for audit purposes.</p>
            <textarea
              id="blockNotes"
              pInputTextarea
              formControlName="notes"
              rows="3"
              placeholder="e.g. Multiple failed authentication attempts detected..."
              class="w-full">
            </textarea>
          </div>

          <!-- Warning Banner -->
          <div class="warning-banner">
            <i class="pi pi-exclamation-triangle warning-icon"></i>
            <div>
              <p class="warning-title">This action will restrict access immediately</p>
              <p class="warning-desc">The user will be unable to log in. All appointments and historical records are preserved.</p>
            </div>
          </div>

        </form>
      </app-dialog-body>

      <app-dialog-footer
        cancelLabel="Cancel"
        submitLabel="Block User"
        submitIcon="pi pi-ban"
        submitSeverity="danger"
        [submitDisabled]="blockForm.invalid || loading"
        [submitLoading]="loading"
        (cancel)="onCancel()"
        (submit)="onConfirm()">
      </app-dialog-footer>

    </app-dialog-shell>
  `,
  styles: [`
    .warning-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 10px;
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .warning-icon {
      color: #dc2626;
      font-size: 1.1rem;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .warning-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #991b1b;
      margin: 0 0 3px;
    }

    .warning-desc {
      font-size: 0.78rem;
      color: #b91c1c;
      margin: 0;
      line-height: 1.5;
    }

    .p-dark .warning-banner {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.2);
    }
    .p-dark .warning-title {
      color: #fca5a5;
    }
    .p-dark .warning-desc {
      color: #f87171;
    }
  `]
})
export class BlockUserModalComponent {
  @Input() visible = false;
  @Input() targetName = '';
  @Input() loading = false;

  @Output() confirm = new EventEmitter<BlockConfirmEvent>();
  @Output() cancel = new EventEmitter<void>();

  blockForm: FormGroup;

  reasonOptions = [
    { label: 'Policy Violation', value: 'Policy Violation' },
    { label: 'Inactive Account', value: 'Inactive Account' },
    { label: 'Security Concern', value: 'Security Concern' },
    { label: 'Other', value: 'Other' }
  ];

  constructor(private fb: FormBuilder) {
    this.blockForm = this.fb.group({
      reason: ['', Validators.required],
      notes: ['']
    });
  }

  onConfirm(): void {
    if (this.blockForm.invalid) return;
    this.confirm.emit(this.blockForm.value as BlockConfirmEvent);
  }

  onCancel(): void {
    this.blockForm.reset();
    this.cancel.emit();
  }

  reset(): void {
    this.blockForm.reset();
  }
}

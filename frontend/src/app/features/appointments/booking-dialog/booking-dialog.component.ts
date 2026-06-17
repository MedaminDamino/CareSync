import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedPrimeNgModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="'Book Appointment'"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '520px', 'border-radius': '16px' }"
      (onHide)="onClose()">

      <div class="booking-dialog-content">
        <div class="doctor-info">
          <i class="pi pi-user-md"></i>
          <div>
            <span class="doctor-name">{{ doctorName }}</span>
            <span class="speciality-badge">{{ specialityName }}</span>
          </div>
        </div>

        <form [formGroup]="bookingForm" class="booking-form">

          <div class="form-row">
            <div class="form-group">
              <label class="form-label"><i class="pi pi-calendar"></i> Appointment Date</label>
              <p-datepicker
                formControlName="date"
                [showTime]="false"
                [minDate]="today"
                [showIcon]="true"
                placeholder="Select date"
                dateFormat="dd/mm/yy"
                [style]="{ width: '100%' }"
                styleClass="w-full">
              </p-datepicker>
              <small class="error-msg" *ngIf="bookingForm.get('date')?.invalid && bookingForm.get('date')?.touched">
                Date is required
              </small>
            </div>

            <div class="form-group">
              <label class="form-label"><i class="pi pi-clock"></i> Time Slot</label>
              <p-select
                formControlName="time"
                [options]="timeSlots"
                placeholder="Select time"
                [style]="{ width: '100%' }"
                styleClass="w-full">
              </p-select>
              <small class="error-msg" *ngIf="bookingForm.get('time')?.invalid && bookingForm.get('time')?.touched">
                Time slot is required
              </small>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"><i class="pi pi-pencil"></i> Reason for Visit</label>
            <textarea
              pTextarea
              formControlName="reason"
              rows="4"
              placeholder="Describe your symptoms or reason for visiting..."
              class="w-full">
            </textarea>
            <small class="error-msg" *ngIf="bookingForm.get('reason')?.invalid && bookingForm.get('reason')?.touched">
              Reason is required
            </small>
          </div>
        </form>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-actions">
          <p-button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            [outlined]="true"
            (onClick)="onClose()">
          </p-button>
          <p-button
            label="Book Appointment"
            icon="pi pi-check"
            [loading]="loading"
            [disabled]="bookingForm.invalid"
            (onClick)="onBook()">
          </p-button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .booking-dialog-content {
      padding: 8px 0 16px;
    }

    .doctor-info {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: linear-gradient(135deg, #667eea15, #764ba215);
      border: 1px solid #667eea30;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .doctor-info .pi {
      font-size: 2rem;
      color: #667eea;
    }

    .doctor-name {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .speciality-badge {
      display: inline-block;
      font-size: 0.75rem;
      color: #667eea;
      background: #667eea18;
      border-radius: 20px;
      padding: 2px 10px;
      margin-top: 3px;
      font-weight: 500;
    }

    .booking-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .form-label .pi {
      color: #667eea;
    }

    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 4px;
    }

    textarea {
      resize: none;
      border-radius: 8px;
      font-family: inherit;
    }
  `]
})
export class BookingDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() doctorId!: number;
  @Input() doctorName = '';
  @Input() specialityName = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() booked = new EventEmitter<void>();

  bookingForm!: FormGroup;
  loading = false;
  today = new Date();
  timeSlots: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      date: [null, Validators.required],
      time: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onClose(): void {
    this.bookingForm.reset();
    this.loading = false;
    this.visibleChange.emit(false);
  }

  onBook(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUserValue;
    if (!user || !user.profileId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Access Denied',
        detail: 'Only registered patients can book appointments'
      });
      return;
    }

    this.loading = true;
    const { date, time, reason } = this.bookingForm.value;

    const d = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    d.setHours(hours, minutes, 0, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const appointmentDateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    this.appointmentService.book({
      doctorId: this.doctorId,
      patientId: user.profileId,
      appointmentDate: appointmentDateStr,
      reason
    }).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment booked successfully!'
        });
        this.booked.emit();
        this.onClose();
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.message || 'Failed to book appointment'
        });
      }
    });
  }
}

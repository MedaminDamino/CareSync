import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AuthService } from '../../../core/services/auth.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusTagComponent } from '../../../shared/components/status-tag/status-tag.component';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SharedPrimeNgModule, PageHeaderComponent, EmptyStateComponent, StatusTagComponent],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  loading = true;
  patientId!: number;
  selectedStatus = 'ALL';
  isVerified = true;

  statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.profileId) {
      this.patientId = user.profileId;
      this.isVerified = user.verified ?? true;
      this.loadAppointments();
    } else {
      this.loading = false;
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Patient profile not found' });
    }
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAll(undefined, this.patientId).subscribe({
      next: (data) => {
        this.appointments = data.sort(
          (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading appointments' });
      }
    });
  }

  onStatusChange(event: { value: string }): void {
    this.selectedStatus = event.value;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredAppointments = this.selectedStatus === 'ALL'
      ? this.appointments
      : this.appointments.filter(a => a.status === this.selectedStatus);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      PENDING: 'warn',
      ACCEPTED: 'info',
      COMPLETED: 'success',
      REJECTED: 'danger',
      CANCELLED: 'secondary'
    };
    return map[status] ?? 'secondary';
  }

  getCount(status: string): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  cancelAppointment(id: number): void {
    if (!this.isVerified) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Verification Required',
        detail: 'Your account must be verified before cancelling appointments.'
      });
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this appointment?',
      header: 'Cancel Appointment',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.appointmentService.updateStatus(id, 'CANCELLED').subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Cancelled', detail: 'Appointment cancelled!' });
            this.loadAppointments();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.message || 'Failed to cancel' });
          }
        });
      }
    });
  }
}

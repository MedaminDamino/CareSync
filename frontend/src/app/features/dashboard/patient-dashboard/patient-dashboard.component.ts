import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusTagComponent } from '../../../shared/components/status-tag/status-tag.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedPrimeNgModule, StatCardComponent, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, StatusTagComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  appointments: any[] = [];
  loading = true;
  patientId!: number;

  totalBooked = 0;
  pendingCount = 0;
  completedCount = 0;

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
      this.loadAppointments();
    } else {
      this.loading = false;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Patient profile not found.' 
      });
    }
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAll(undefined, this.patientId).subscribe({
      next: (data) => {
        const all = data.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        
        this.totalBooked = all.length;
        this.pendingCount = all.filter(a => a.status === 'PENDING').length;
        this.completedCount = all.filter(a => a.status === 'COMPLETED').length;
        
        this.appointments = all.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to load appointments.' 
        });
      }
    });
  }

  cancelAppointment(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this appointment?',
      header: 'Cancel Appointment',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.appointmentService.updateStatus(id, 'CANCELLED').subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Cancelled', 
              detail: 'Appointment cancelled successfully!' 
            });
            this.loadAppointments();
          },
          error: (err) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: err || 'Failed to cancel appointment' 
            });
          }
        });
      }
    });
  }
}

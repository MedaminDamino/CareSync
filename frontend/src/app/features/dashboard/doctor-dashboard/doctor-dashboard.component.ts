import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { MessageService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusTagComponent } from '../../../shared/components/status-tag/status-tag.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule, PageHeaderComponent, LoadingStateComponent, EmptyStateComponent, StatusTagComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  loading = true;
  doctorId!: number;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.profileId) {
      this.doctorId = user.profileId;
      this.loadAppointments();
    } else {
      this.loading = false;
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Doctor profile not found.' 
      });
    }
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAll(this.doctorId).subscribe({
      next: (data) => {
        this.appointments = data.sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
          if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
          return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
        });
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

  updateStatus(id: number, status: string): void {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Status Updated', 
          detail: `Appointment ${status.toLowerCase()} successfully!` 
        });
        this.loadAppointments();
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Update Failed', 
          detail: err || 'Failed to update appointment status' 
        });
      }
    });
  }
}

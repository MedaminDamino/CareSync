import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatusTagComponent } from '../../../shared/components/status-tag/status-tag.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar.component';
import { ActionToolbarComponent } from '../../../shared/components/action-toolbar/action-toolbar.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    SharedPrimeNgModule, 
    PageHeaderComponent, 
    EmptyStateComponent, 
    StatusTagComponent,
    SearchBarComponent,
    FilterBarComponent,
    ActionToolbarComponent
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  searchQuery = '';
  selectedStatus: string | null = null;
  loading = true;

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  constructor(
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.appointments = data.sort(
          (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        this.applySearchFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load appointments.' });
      }
    });
  }

  applySearchFilter(): void {
    let filtered = this.appointments;

    if (this.selectedStatus) {
      filtered = filtered.filter(apt => apt.status === this.selectedStatus);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(apt => 
        (apt.patientName && apt.patientName.toLowerCase().includes(query)) ||
        (apt.doctorName && apt.doctorName.toLowerCase().includes(query)) ||
        (apt.specialityName && apt.specialityName.toLowerCase().includes(query)) ||
        (apt.id && String(apt.id).includes(query))
      );
    }

    this.filteredAppointments = filtered;
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applySearchFilter();
  }

  onStatusFilter(status: any): void {
    this.selectedStatus = status;
    this.applySearchFilter();
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

  cancelAppointment(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this appointment?',
      header: 'Cancel Appointment',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.appointmentService.updateStatus(id, 'CANCELLED').subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Cancelled', detail: 'Appointment cancelled successfully!' });
            this.loadAppointments();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.message || 'Failed to cancel appointment' });
          }
        });
      }
    });
  }

}

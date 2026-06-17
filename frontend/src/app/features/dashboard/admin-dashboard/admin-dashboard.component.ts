import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { DashboardService } from '../../../core/services/dashboard.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule, StatCardComponent, PageHeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  };
  loading = true;

  public statusChartType = 'doughnut';
  public statusChartData: any = {
    labels: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#eab308', '#2563eb', '#ef4444', '#10b981', '#64748b'],
      hoverOffset: 4
    }]
  };
  public statusChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  public monthChartType = 'line';
  public monthChartData: any = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Appointments',
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };
  public monthChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  public specChartType = 'bar';
  public specChartData: any = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Bookings',
      backgroundColor: '#8b5cf6',
      borderRadius: 6
    }]
  };
  public specChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;

        const statusMap = data.appointmentsByStatus || {};
        this.statusChartData = {
          ...this.statusChartData,
          datasets: [{
            ...this.statusChartData.datasets[0],
            data: [
              statusMap['PENDING'] || 0,
              statusMap['ACCEPTED'] || 0,
              statusMap['REJECTED'] || 0,
              statusMap['COMPLETED'] || 0,
              statusMap['CANCELLED'] || 0
            ]
          }]
        };

        const months = (data.appointmentsPerMonth || []).map((m: any) => m.month);
        const monthCounts = (data.appointmentsPerMonth || []).map((m: any) => m.count);
        this.monthChartData = {
          labels: months.length ? months : ['No Data'],
          datasets: [{
            ...this.monthChartData.datasets[0],
            data: monthCounts.length ? monthCounts : [0]
          }]
        };

        const specs = (data.mostRequestedSpecialities || []).map((s: any) => s.specialityName);
        const specCounts = (data.mostRequestedSpecialities || []).map((s: any) => s.count);
        this.specChartData = {
          labels: specs.length ? specs : ['No Data'],
          datasets: [{
            ...this.specChartData.datasets[0],
            data: specCounts.length ? specCounts : [0]
          }]
        };

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

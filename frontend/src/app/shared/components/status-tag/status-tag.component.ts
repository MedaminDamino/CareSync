import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-tag.component.html',
  styles: []
})
export class StatusTagComponent {
  @Input() status: string = '';

  get statusClass(): string {
    if (!this.status) return 'status-cancelled';
    switch (this.status.toUpperCase()) {
      case 'PENDING': return 'status-pending';
      case 'ACCEPTED': return 'status-accepted';
      case 'COMPLETED': return 'status-completed';
      case 'REJECTED': return 'status-rejected';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-cancelled';
    }
  }

  get statusIcon(): string {
    if (!this.status) return 'pi pi-info-circle';
    switch (this.status.toUpperCase()) {
      case 'PENDING': return 'pi pi-clock';
      case 'ACCEPTED': return 'pi pi-check-circle';
      case 'COMPLETED': return 'pi pi-check-square';
      case 'REJECTED': return 'pi pi-times-circle';
      case 'CANCELLED': return 'pi pi-ban';
      default: return 'pi pi-info-circle';
    }
  }
}

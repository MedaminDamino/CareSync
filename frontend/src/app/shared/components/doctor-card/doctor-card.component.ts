import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css']
})
export class DoctorCardComponent {
  @Input() doctor: any;
  @Input() isAdmin = false;
  @Input() isPatient = false;

  @Output() book = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();
  @Output() block = new EventEmitter<any>();
  @Output() unblock = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() verify = new EventEmitter<any>();

  imageError = false;

  avatarUrls = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256&q=80', // female
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256&q=80', // male
    'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=256&h=256&q=80', // female
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&h=256&q=80', // male
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&h=256&q=80', // male
    'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=256&h=256&q=80', // male
    'https://images.unsplash.com/photo-1582750433449-649350141f2f?auto=format&fit=crop&w=256&h=256&q=80', // female
    'https://images.unsplash.com/photo-1622902046580-2b47f47f0471?auto=format&fit=crop&w=256&h=256&q=80'  // female
  ];

  getDoctorAvatar(): string {
    if (this.doctor?.avatarUrl) {
      return this.doctor.avatarUrl;
    }
    const idx = (this.doctor?.id || 0) % this.avatarUrls.length;
    return this.avatarUrls[idx];
  }

  onImageError(): void {
    this.imageError = true;
  }

  cleanDoctorName(name: string): string {
    if (!name) return '';
    let cleaned = name.trim();
    while (cleaned.toLowerCase().startsWith('dr.')) {
      cleaned = cleaned.substring(3).trim();
    }
    while (cleaned.toLowerCase().startsWith('dr ')) {
      cleaned = cleaned.substring(3).trim();
    }
    return cleaned;
  }
}

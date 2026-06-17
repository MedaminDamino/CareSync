import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  templateUrl: './stat-card.component.html',
  styles: []
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() icon: string = '';
  @Input() colorClass: string = 'text-primary';
  @Input() bgClass: string = 'bg-primary-light';
}

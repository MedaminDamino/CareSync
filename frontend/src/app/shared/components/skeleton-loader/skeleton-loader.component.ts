import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'table' | 'list' | 'text' = 'card';
  @Input() count: number = 1;

  get countArray() {
    return Array(this.count).fill(0);
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styles: []
})
export class EmptyStateComponent {
  @Input() icon: string = 'pi pi-inbox';
  @Input() message: string = 'No records found.';
  @Input() description: string = '';
}

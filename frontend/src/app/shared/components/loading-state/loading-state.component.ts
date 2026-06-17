import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPrimeNgModule } from '../../primeng.module';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule, SharedPrimeNgModule],
  templateUrl: './loading-state.component.html',
  styles: []
})
export class LoadingStateComponent {
  @Input() message: string = 'Loading data...';
  @Input() minHeight: string = '20rem';
}

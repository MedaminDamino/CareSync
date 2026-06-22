import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';

@Component({
  selector: 'app-pending-verification',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedPrimeNgModule],
  templateUrl: './pending-verification.component.html',
  styleUrls: ['./pending-verification.component.css']
})
export class PendingVerificationComponent {}

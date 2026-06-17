import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedPrimeNgModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Welcome back!', 
          detail: 'Login successful.' 
        });
        
        if (user.role === 'ADMIN') {
          this.router.navigate(['/dashboard/admin']);
        } else if (user.role === 'DOCTOR') {
          this.router.navigate(['/dashboard/doctor']);
        } else if (user.role === 'PATIENT') {
          this.router.navigate(['/dashboard/patient']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Login Failed', 
          detail: err || 'Invalid email or password' 
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { AuthService } from '../../../core/services/auth.service';
import { SpecialityService } from '../../../core/services/speciality.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedPrimeNgModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  specialities: any[] = [];
  today = new Date();
  
  roleOptions = [
    { label: 'Patient', value: 'PATIENT' },
    { label: 'Doctor', value: 'DOCTOR' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private specialityService: SpecialityService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      role: ['PATIENT', Validators.required],
      dateOfBirth: [null],
      specialityId: [null]
    });
  }

  ngOnInit(): void {
    this.specialityService.getAll().subscribe({
      next: (data) => this.specialities = data,
      error: () => this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Could not load specialities list.' 
      })
    });

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateValidatorsByRole(role);
    });
    this.updateValidatorsByRole('PATIENT');
  }

  updateValidatorsByRole(role: string): void {
    const dobControl = this.registerForm.get('dateOfBirth');
    const specControl = this.registerForm.get('specialityId');

    if (role === 'PATIENT') {
      dobControl?.setValidators([Validators.required]);
      specControl?.clearValidators();
      specControl?.setValue(null);
    } else if (role === 'DOCTOR') {
      specControl?.setValidators([Validators.required]);
      dobControl?.clearValidators();
      dobControl?.setValue(null);
    }
    dobControl?.updateValueAndValidity();
    specControl?.updateValueAndValidity();
  }

  get showPatientFields(): boolean {
    return this.registerForm.get('role')?.value === 'PATIENT';
  }

  get showDoctorFields(): boolean {
    return this.registerForm.get('role')?.value === 'DOCTOR';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = { ...this.registerForm.value };
    
    if (formValue.dateOfBirth) {
      const d = new Date(formValue.dateOfBirth);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      formValue.dateOfBirth = `${year}-${month}-${day}`;
    }

    this.authService.register(formValue).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.verified) {
          this.authService.saveSession(response);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Welcome to CareSync!', 
            detail: 'Registration successful. Automatically logged in.' 
          });
          
          if (response.role === 'ADMIN') {
            this.router.navigate(['/dashboard/admin']);
          } else if (response.role === 'DOCTOR') {
            this.router.navigate(['/dashboard/doctor']);
          } else if (response.role === 'PATIENT') {
            this.router.navigate(['/dashboard/patient']);
          }
        } else {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Registration Successful', 
            detail: 'Account created! Pending verification.' 
          });
          this.router.navigate(['/pending-verification']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Registration Failed', 
          detail: err || 'Please check your information.' 
        });
      }
    });
  }
}

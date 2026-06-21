import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { DoctorService } from '../../../core/services/doctor.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SpecialityService } from '../../../core/services/speciality.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { UserService, BlockUserRequest } from '../../../core/services/user.service';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar.component';
import { ActionToolbarComponent } from '../../../shared/components/action-toolbar/action-toolbar.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { DialogShellComponent } from '../../../shared/components/dialog-shell/dialog-shell.component';
import { DialogBodyComponent } from '../../../shared/components/dialog-body/dialog-body.component';
import { BlockUserModalComponent, BlockConfirmEvent } from '../../../shared/components/block-user-modal/block-user-modal.component';
import { DetailsDrawerComponent } from '../../../shared/components/details-drawer/details-drawer.component';
import { DialogFooterComponent } from '../../../shared/components/dialog-footer/dialog-footer.component';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedPrimeNgModule,
    PageHeaderComponent,
    EmptyStateComponent,
    SearchBarComponent,
    FilterBarComponent,
    ActionToolbarComponent,
    SkeletonLoaderComponent,
    DialogShellComponent,
    DialogBodyComponent,
    BlockUserModalComponent,
    DetailsDrawerComponent,
    DialogFooterComponent
  ],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'],
  providers: [MessageService]
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  specialities: any[] = [];
  selectedSpecialityId: number | null = null;
  searchQuery = '';
  loading = true;
  userRole!: string;

  // Doctor Modal State
  displayDoctorModal = false;
  isEdit = false;
  selectedDoctorId: number | null = null;
  selectedDoctor: any = null;
  docForm: FormGroup;
  savingDoctor = false;

  // Booking Dialog State
  displayBookingDialog = false;
  bookingDoctor: any = null;
  bookingForm: FormGroup;
  bookingLoading = false;
  today = new Date();
  timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  // Block/Drawer State
  displayBlockModal = false;
  displayDrawer = false;
  blockLoading = false;

  constructor(
    private doctorService: DoctorService,
    private specialityService: SpecialityService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.docForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      specialityId: ['', Validators.required],
      password: ['']
    });

    this.bookingForm = this.fb.group({
      date: [null, Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.userRole = user ? user.role : 'PATIENT';
    this.loadSpecialities();
    this.loadDoctors();
  }

  loadSpecialities(): void {
    this.specialityService.getAll().subscribe({
      next: (data) => this.specialities = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading specialities' })
    });
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAll(this.selectedSpecialityId || undefined).subscribe({
      next: (data) => {
        this.doctors = data.map((doc: any) => ({
          ...doc,
          experience: doc.id % 2 === 0 ? '8 Years' : doc.id % 3 === 0 ? '12 Years' : '5 Years',
          rating: (4.3 + (doc.id % 7) / 10).toFixed(1),
          availability: doc.id % 2 === 0 ? 'Available Today' : 'Available Tomorrow',
          reviewsCount: (doc.id * 7 + 12) % 45 + 5
        }));
        this.applySearchFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading doctors list' });
      }
    });
  }

  applySearchFilter(): void {
    if (!this.searchQuery) {
      this.filteredDoctors = this.doctors;
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredDoctors = this.doctors.filter(doc =>
        doc.name.toLowerCase().includes(query) ||
        doc.email.toLowerCase().includes(query) ||
        (doc.speciality?.name && doc.speciality.name.toLowerCase().includes(query))
      );
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applySearchFilter();
  }

  filterBySpeciality(specialityId: any): void {
    this.selectedSpecialityId = specialityId;
    this.loadDoctors();
  }

  get isAdmin(): boolean { return this.userRole === 'ADMIN'; }
  get isPatient(): boolean { return this.userRole === 'PATIENT'; }

  openCreateModal(): void {
    this.isEdit = false;
    this.selectedDoctorId = null;
    this.docForm.reset({ name: '', email: '', phone: '', specialityId: '', password: '' });
    this.docForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.docForm.get('password')?.updateValueAndValidity();
    this.displayDoctorModal = true;
  }

  openEditModal(doctor: any): void {
    this.isEdit = true;
    this.selectedDoctorId = doctor.id;
    this.selectedDoctor = doctor;
    this.docForm.get('password')?.clearValidators();
    this.docForm.get('password')?.updateValueAndValidity();
    this.docForm.patchValue({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialityId: doctor.speciality?.id || '',
      password: ''
    });
    this.displayDoctorModal = true;
  }

  viewDoctor(doctor: any): void {
    this.selectedDoctor = doctor;
    this.displayDrawer = true;
  }

  openBlockModal(doctor: any): void {
    this.selectedDoctor = doctor;
    this.displayBlockModal = true;
  }

  saveDoctor(): void {
    if (this.docForm.invalid) return;

    this.savingDoctor = true;
    const formValue = this.docForm.value;
    const doctorDTO: any = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      speciality: { id: formValue.specialityId }
    };
    if (!this.isEdit && formValue.password) {
      doctorDTO.password = formValue.password;
    }

    const obs = this.isEdit && this.selectedDoctorId
      ? this.doctorService.update(this.selectedDoctorId, doctorDTO)
      : this.doctorService.create(doctorDTO);

    obs.subscribe({
      next: () => {
        this.savingDoctor = false;
        this.displayDoctorModal = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Doctor profile saved successfully!' });
        this.loadDoctors();
      },
      error: (err) => {
        this.savingDoctor = false;
        this.messageService.add({ severity: 'error', summary: 'Save Failed', detail: err || 'Failed to save doctor.' });
      }
    });
  }

  executeBlock(event: BlockConfirmEvent): void {
    if (!this.selectedDoctor?.userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot identify user account for this doctor.' });
      return;
    }
    this.blockLoading = true;
    const request: BlockUserRequest = { reason: event.reason, notes: event.notes };

    this.userService.blockUser(this.selectedDoctor.userId, request).subscribe({
      next: () => {
        this.blockLoading = false;
        this.displayBlockModal = false;
        this.messageService.add({ severity: 'warn', summary: 'Doctor Blocked', detail: `Dr. ${this.selectedDoctor.name}'s account has been blocked.` });
        this.selectedDoctor = null;
        this.loadDoctors();
      },
      error: (err) => {
        this.blockLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Block Failed', detail: err || 'Failed to block doctor.' });
      }
    });
  }

  unblockDoctor(doctor: any): void {
    if (!doctor?.userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot identify user account.' });
      return;
    }
    this.userService.unblockUser(doctor.userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Doctor Unblocked', detail: `Dr. ${doctor.name}'s account has been reactivated.` });
        this.loadDoctors();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Unblock Failed', detail: err || 'Failed to unblock doctor.' });
      }
    });
  }

  openBookingDialog(doctor: any): void {
    this.bookingDoctor = doctor;
    this.bookingForm.reset({ date: null, time: '', reason: '' });
    this.displayBookingDialog = true;
  }

  bookAppointment(): void {
    if (this.bookingForm.invalid) return;

    const user = this.authService.currentUserValue;
    if (!user || !user.profileId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Only patients can book appointments.' });
      return;
    }

    this.bookingLoading = true;
    const formValue = this.bookingForm.value;
    const d = new Date(formValue.date);
    const [hours, minutes] = formValue.time.split(':');
    d.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const pad = (n: number) => String(n).padStart(2, '0');
    const appointmentDateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    this.appointmentService.book({
      doctorId: this.bookingDoctor.id,
      patientId: user.profileId,
      appointmentDate: appointmentDateStr,
      reason: formValue.reason
    }).subscribe({
      next: () => {
        this.bookingLoading = false;
        this.displayBookingDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Booking Confirmed', detail: 'Appointment booked successfully!' });
      },
      error: (err) => {
        this.bookingLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Booking Failed', detail: err || 'Failed to book appointment.' });
      }
    });
  }
}

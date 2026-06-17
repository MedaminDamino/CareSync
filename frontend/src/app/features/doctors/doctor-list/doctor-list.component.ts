import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { DoctorService } from '../../../core/services/doctor.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SpecialityService } from '../../../core/services/speciality.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar.component';
import { ActionToolbarComponent } from '../../../shared/components/action-toolbar/action-toolbar.component';

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
    ActionToolbarComponent
  ],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  specialities: any[] = [];
  selectedSpecialityId: number | null = null;
  searchQuery = '';
  loading = true;
  userRole!: string;

  // Doctor Dialog State
  displayDoctorDialog = false;
  isEdit = false;
  selectedDoctorId: number | null = null;
  docForm: FormGroup;
  savingDoctor = false;

  // Booking Dialog State
  displayBookingDialog = false;
  bookingDoctor: any = null;
  bookingForm: FormGroup;
  bookingLoading = false;
  today = new Date();
  timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  constructor(
    private doctorService: DoctorService,
    private specialityService: SpecialityService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.docForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      specialityId: ['', Validators.required]
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

  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  get isPatient(): boolean {
    return this.userRole === 'PATIENT';
  }

  openDoctorDialog(doctor?: any): void {
    if (doctor) {
      this.isEdit = true;
      this.selectedDoctorId = doctor.id;
      this.docForm.patchValue({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialityId: doctor.speciality?.id || ''
      });
    } else {
      this.isEdit = false;
      this.selectedDoctorId = null;
      this.docForm.reset({
        name: '',
        email: '',
        phone: '',
        specialityId: ''
      });
    }
    this.displayDoctorDialog = true;
  }

  saveDoctor(): void {
    if (this.docForm.invalid) return;

    this.savingDoctor = true;
    const formValue = this.docForm.value;
    const doctorDTO = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      speciality: {
        id: formValue.specialityId
      }
    };

    const obs = this.isEdit && this.selectedDoctorId
      ? this.doctorService.update(this.selectedDoctorId, doctorDTO)
      : this.doctorService.create(doctorDTO);

    obs.subscribe({
      next: () => {
        this.savingDoctor = false;
        this.displayDoctorDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Doctor profile saved successfully!' });
        this.loadDoctors();
      },
      error: (err) => {
        this.savingDoctor = false;
        this.messageService.add({ severity: 'error', summary: 'Save Failed', detail: err || 'Failed to save doctor.' });
      }
    });
  }

  deleteDoctor(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this doctor? Their credentials and profile will be permanently removed.',
      header: 'Delete Doctor',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doctorService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Doctor profile deleted successfully!' });
            this.loadDoctors();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: err || 'Failed to delete doctor profile.' });
          }
        });
      }
    });
  }

  openBookingDialog(doctor: any): void {
    this.bookingDoctor = doctor;
    this.bookingForm.reset({
      date: null,
      time: '',
      reason: ''
    });
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

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const appointmentDateStr = `${year}-${month}-${day}T${hh}:${mm}:00`;

    const appointmentDTO = {
      doctorId: this.bookingDoctor.id,
      patientId: user.profileId,
      appointmentDate: appointmentDateStr,
      reason: formValue.reason
    };

    this.appointmentService.book(appointmentDTO).subscribe({
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { PatientService } from '../../../core/services/patient.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ActionToolbarComponent } from '../../../shared/components/action-toolbar/action-toolbar.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    SharedPrimeNgModule, 
    PageHeaderComponent, 
    EmptyStateComponent,
    SearchBarComponent,
    ActionToolbarComponent
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchQuery = '';
  loading = true;
  saving = false;

  // Dialog State
  displayDialog = false;
  isEdit = false;
  selectedPatientId: number | null = null;
  patForm: FormGroup;
  today = new Date();

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.patForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.patients = data;
        this.applySearchFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load patients list.' });
      }
    });
  }

  applySearchFilter(): void {
    if (!this.searchQuery) {
      this.filteredPatients = this.patients;
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredPatients = this.patients.filter(pat => 
        pat.name.toLowerCase().includes(query) || 
        pat.email.toLowerCase().includes(query) ||
        pat.phone.toLowerCase().includes(query)
      );
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applySearchFilter();
  }

  openPatientDialog(patient?: any): void {
    if (patient) {
      this.isEdit = true;
      this.selectedPatientId = patient.id;
      this.patForm.patchValue({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : null
      });
    } else {
      this.isEdit = false;
      this.selectedPatientId = null;
      this.patForm.reset({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: null
      });
    }
    this.displayDialog = true;
  }

  savePatient(): void {
    if (this.patForm.invalid) return;

    this.saving = true;
    const formValue = { ...this.patForm.value };

    if (formValue.dateOfBirth) {
      const d = new Date(formValue.dateOfBirth);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      formValue.dateOfBirth = `${year}-${month}-${day}`;
    }

    const obs = this.isEdit && this.selectedPatientId
      ? this.patientService.update(this.selectedPatientId, formValue)
      : this.patientService.create(formValue);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.displayDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Patient profile saved successfully!' });
        this.loadPatients();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Save Failed', detail: err || 'Failed to save patient.' });
      }
    });
  }

  deletePatient(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this patient? Their appointments and credentials will be removed.',
      header: 'Delete Patient',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.patientService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Patient profile deleted successfully!' });
            this.loadPatients();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: err || 'Failed to delete patient profile.' });
          }
        });
      }
    });
  }
}

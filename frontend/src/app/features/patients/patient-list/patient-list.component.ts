import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { PatientService } from '../../../core/services/patient.service';
import { UserService, BlockUserRequest } from '../../../core/services/user.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ActionToolbarComponent } from '../../../shared/components/action-toolbar/action-toolbar.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { DialogShellComponent } from '../../../shared/components/dialog-shell/dialog-shell.component';
import { DialogBodyComponent } from '../../../shared/components/dialog-body/dialog-body.component';
import { BlockUserModalComponent, BlockConfirmEvent } from '../../../shared/components/block-user-modal/block-user-modal.component';
import { DetailsDrawerComponent } from '../../../shared/components/details-drawer/details-drawer.component';
import { DialogFooterComponent } from '../../../shared/components/dialog-footer/dialog-footer.component';

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
    ActionToolbarComponent,
    SkeletonLoaderComponent,
    DialogShellComponent,
    DialogBodyComponent,
    BlockUserModalComponent,
    DetailsDrawerComponent,
    DialogFooterComponent
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchQuery = '';
  loading = true;
  saving = false;
  blockLoading = false;

  // Modal state
  displayCreateModal = false;
  displayBlockModal = false;
  displayDrawer = false;
  selectedPatient: any = null;

  patForm: FormGroup;
  today = new Date();

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.patForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

  openCreateModal(): void {
    this.patForm.reset({ name: '', email: '', phone: '', dateOfBirth: null, password: '' });
    this.displayCreateModal = true;
  }

  viewPatient(patient: any): void {
    this.selectedPatient = patient;
    this.displayDrawer = true;
  }

  openBlockModal(patient: any): void {
    this.selectedPatient = patient;
    this.displayBlockModal = true;
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

    this.patientService.create(formValue).subscribe({
      next: () => {
        this.saving = false;
        this.displayCreateModal = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Patient registered successfully!' });
        this.loadPatients();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err || 'Failed to register patient.' });
      }
    });
  }

  executeBlock(event: BlockConfirmEvent): void {
    if (!this.selectedPatient?.userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot identify user account for this patient.' });
      return;
    }

    this.blockLoading = true;
    const request: BlockUserRequest = { reason: event.reason, notes: event.notes };

    this.userService.blockUser(this.selectedPatient.userId, request).subscribe({
      next: () => {
        this.blockLoading = false;
        this.displayBlockModal = false;
        this.messageService.add({ severity: 'warn', summary: 'User Blocked', detail: `${this.selectedPatient.name}'s account has been blocked.` });
        this.selectedPatient = null;
        this.loadPatients();
      },
      error: (err) => {
        this.blockLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Block Failed', detail: err || 'Failed to block user.' });
      }
    });
  }

  unblockPatient(patient: any): void {
    if (!patient?.userId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot identify user account.' });
      return;
    }

    this.userService.unblockUser(patient.userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'User Unblocked', detail: `${patient.name}'s account has been reactivated.` });
        this.loadPatients();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Unblock Failed', detail: err || 'Failed to unblock user.' });
      }
    });
  }
}

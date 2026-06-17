import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedPrimeNgModule } from '../../../shared/primeng.module';
import { SpecialityService } from '../../../core/services/speciality.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ActionToolbarComponent } from '../../../shared/components/action-toolbar/action-toolbar.component';

@Component({
  selector: 'app-speciality-list',
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
  templateUrl: './speciality-list.component.html',
  styleUrls: ['./speciality-list.component.css']
})
export class SpecialityListComponent implements OnInit {
  specialities: any[] = [];
  filteredSpecialities: any[] = [];
  searchQuery = '';
  loading = true;
  saving = false;

  // Dialog state
  displayDialog = false;
  isEdit = false;
  selectedSpecialityId: number | null = null;
  specForm: FormGroup;

  constructor(
    private specialityService: SpecialityService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.specForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadSpecialities();
  }

  loadSpecialities(): void {
    this.loading = true;
    this.specialityService.getAll().subscribe({
      next: (data) => {
        this.specialities = data;
        this.applySearchFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to load specialities.' 
        });
      }
    });
  }

  applySearchFilter(): void {
    if (!this.searchQuery) {
      this.filteredSpecialities = this.specialities;
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredSpecialities = this.specialities.filter(spec => 
        spec.name.toLowerCase().includes(query) || 
        (spec.description && spec.description.toLowerCase().includes(query))
      );
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applySearchFilter();
  }

  openDialog(speciality?: any): void {
    if (speciality) {
      this.isEdit = true;
      this.selectedSpecialityId = speciality.id;
      this.specForm.patchValue({
        name: speciality.name,
        description: speciality.description
      });
    } else {
      this.isEdit = false;
      this.selectedSpecialityId = null;
      this.specForm.reset({
        name: '',
        description: ''
      });
    }
    this.displayDialog = true;
  }

  saveSpeciality(): void {
    if (this.specForm.invalid) return;

    this.saving = true;
    const data = this.specForm.value;
    const obs = this.isEdit && this.selectedSpecialityId
      ? this.specialityService.update(this.selectedSpecialityId, data)
      : this.specialityService.create(data);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.displayDialog = false;
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `Speciality ${this.isEdit ? 'updated' : 'created'} successfully!` 
        });
        this.loadSpecialities();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Save Failed', 
          detail: err || 'Error occurred while saving.' 
        });
      }
    });
  }

  deleteSpeciality(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this speciality? All linked doctors will need to be reallocated.',
      header: 'Delete Speciality',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.specialityService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Deleted', 
              detail: 'Speciality deleted successfully!' 
            });
            this.loadSpecialities();
          },
          error: (err) => {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Delete Failed', 
              detail: err || 'Failed to delete speciality.' 
            });
          }
        });
      }
    });
  }
}

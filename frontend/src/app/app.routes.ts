import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LayoutComponent } from './features/layout/layout.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './features/dashboard/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './features/dashboard/patient-dashboard/patient-dashboard.component';
import { SpecialityListComponent } from './features/specialities/speciality-list/speciality-list.component';
import { DoctorListComponent } from './features/doctors/doctor-list/doctor-list.component';
import { PatientListComponent } from './features/patients/patient-list/patient-list.component';
import { AppointmentListComponent } from './features/appointments/appointment-list/appointment-list.component';
import { MyAppointmentsComponent } from './features/appointments/my-appointments/my-appointments.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard/admin',
        component: AdminDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'dashboard/doctor',
        component: DoctorDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['DOCTOR'] }
      },
      {
        path: 'dashboard/patient',
        component: PatientDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['PATIENT'] }
      },
      {
        path: 'specialities',
        component: SpecialityListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'doctors',
        component: DoctorListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'PATIENT'] }
      },
      {
        path: 'patients',
        component: PatientListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'appointments',
        component: AppointmentListComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'appointments/my',
        component: MyAppointmentsComponent,
        canActivate: [roleGuard],
        data: { roles: ['PATIENT'] }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard/admin'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];


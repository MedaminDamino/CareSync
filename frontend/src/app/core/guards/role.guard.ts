import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  const currentUser = authService.currentUserValue;

  if (currentUser && expectedRoles.includes(currentUser.role)) {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
  } else {
    const role = currentUser.role;
    if (role === 'ADMIN') {
      router.navigate(['/dashboard/admin']);
    } else if (role === 'DOCTOR') {
      router.navigate(['/dashboard/doctor']);
    } else if (role === 'PATIENT') {
      router.navigate(['/dashboard/patient']);
    } else {
      router.navigate(['/login']);
    }
  }
  return false;
};

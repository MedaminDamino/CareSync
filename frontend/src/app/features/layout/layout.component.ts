import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SharedPrimeNgModule } from '../../shared/primeng.module';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedPrimeNgModule, ThemeToggleComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  currentUser: any;
  isVerified = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.checkVerification();
      }
    });
  }

  checkVerification(): void {
    if (this.currentUser.role === 'ADMIN') {
      this.isVerified = true;
      return;
    }
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.isVerified = profile.verified;
        if (this.currentUser.verified !== profile.verified) {
          const updated = { ...this.currentUser, verified: profile.verified };
          this.authService.updateCurrentUser(updated);
        }
      },
      error: () => {
        this.isVerified = this.currentUser.verified ?? true;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  get isDoctor(): boolean {
    return this.currentUser?.role === 'DOCTOR';
  }

  get isPatient(): boolean {
    return this.currentUser?.role === 'PATIENT';
  }
}

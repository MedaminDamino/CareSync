import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from './api.config';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    const user = this.tokenStorage.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => this.saveSession(response))
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/register`, user);
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.currentUserSubject.next(null);
  }

  saveSession(response: any): void {
    this.tokenStorage.saveToken(response.token);
    this.tokenStorage.saveUser(response);
    this.currentUserSubject.next(response);
  }

  updateCurrentUser(user: any): void {
    this.tokenStorage.saveUser(user);
    this.currentUserSubject.next(user);
  }

  isLoggedIn(): boolean {
    return this.tokenStorage.getToken() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user && user.role === role;
  }
}

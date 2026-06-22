import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

export interface BlockUserRequest {
  reason: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  blockUser(userId: number, request: BlockUserRequest): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/block`, request);
  }

  unblockUser(userId: number): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/unblock`, {});
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`);
  }
}

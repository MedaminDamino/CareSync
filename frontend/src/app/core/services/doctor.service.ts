import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = `${API_URL}/doctors`;

  constructor(private http: HttpClient) {}

  getAll(specialityId?: number, verified?: boolean): Observable<any[]> {
    let params = new HttpParams();
    if (specialityId) {
      params = params.set('specialityId', specialityId.toString());
    }
    if (verified !== undefined && verified !== null) {
      params = params.set('verified', verified.toString());
    }
    return this.http.get<any[]>(this.baseUrl, { params });
  }

  verify(id: number, verified: boolean): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/verify?verified=${verified}`, {});
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(doctor: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, doctor);
  }

  update(id: number, doctor: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, doctor);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

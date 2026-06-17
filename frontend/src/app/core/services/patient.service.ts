import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = `${API_URL}/patients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(patient: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, patient);
  }

  update(id: number, patient: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, patient);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = `${API_URL}/appointments`;

  constructor(private http: HttpClient) {}

  getAll(doctorId?: number, patientId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (doctorId) {
      params = params.set('doctorId', doctorId.toString());
    } else if (patientId) {
      params = params.set('patientId', patientId.toString());
    }
    return this.http.get<any[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  book(appointment: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, appointment);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/status`, {}, {
      params: new HttpParams().set('status', status)
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

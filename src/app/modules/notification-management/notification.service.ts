import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly http: HttpClient) {}
  private apiNotifi = 'http://localhost:3000/notifications';

  getAllNotifi(): Observable<any[]> {
    return this.http.get<any[]>(this.apiNotifi);
  }

  getNotifiById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiNotifi}/${id}`);
  }

  createNotifi(payload: any): Observable<any> {
    return this.http.post<any>(this.apiNotifi, payload);
  }

  putNotifi(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiNotifi}/${id}`, payload);
  }

  deleteNotifi(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiNotifi}/${id}`);
  }
}

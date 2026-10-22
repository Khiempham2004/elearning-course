import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly http: HttpClient) {}
  private readonly apiNotifi =
    'http://localhost:3001/api/directory/notification-management';

  getAllNotifi(
    page: number,
    pageSize: number,
    keyword: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }
    return this.http.get<any[]>(this.apiNotifi, { params });
  }

  getNotifiById(id: any): Observable<any[]> {
    return this.http.get<any>(`${this.apiNotifi}/${id}`);
  }

  createNotifi(payload: any): Observable<any> {
    return this.http.post<any[]>(this.apiNotifi, payload);
  }

  putNotifi(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiNotifi}/${id}`, payload);
  }

  deleteNotifi(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiNotifi}/${id}`);
  }
}

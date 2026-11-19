import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AdminEnrollmentsService {
  private readonly api = 'http://localhost:3001/api/admin/enrollments';
  constructor(private readonly http: HttpClient) {}
  list(page: number, limit: number, q: string, courseId: string, status: string) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (q.trim()) params = params.set('q', q.trim());
    if (courseId) params = params.set('courseId', courseId);
    if (status) params = params.set('status', status);
    return this.http.get<any>(this.api, { params });
  }
  update(id: string, payload: any) { return this.http.patch<any>(`${this.api}/${id}`, payload); }
}

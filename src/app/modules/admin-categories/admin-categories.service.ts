import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminCategoriesService {
  private readonly api = 'http://localhost:3001/api/admin/categories';
  constructor(private readonly http: HttpClient) {}
  list(q: string, status: string) {
    let params = new HttpParams();
    if (q.trim()) params = params.set('q', q.trim());
    if (status) params = params.set('status', status);
    return this.http.get<any>(this.api, { params });
  }
  create(payload: any) { return this.http.post<any>(this.api, payload); }
  update(id: string, payload: any) { return this.http.put<any>(`${this.api}/${id}`, payload); }
  remove(id: string) { return this.http.delete<any>(`${this.api}/${id}`); }
}

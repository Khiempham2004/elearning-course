import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RoleRecord {
  _id?: string;
  id?: string;
  roleCode: string;
  roleName: string;
  description?: string;
  permissionIds?: unknown[];
  status?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RoleManagementService {
  private readonly apiUrl =
    'http://localhost:3001/api/directory/role-management';

  constructor(private readonly http: HttpClient) {}

  getRoles(page: number, limit: number, keyword = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
    if (keyword.trim()) params = params.set('q', keyword.trim());
    return this.http.get<any>(this.apiUrl, { params });
  }

  getRole(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRole(payload: RoleRecord): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateRole(id: string, payload: RoleRecord): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

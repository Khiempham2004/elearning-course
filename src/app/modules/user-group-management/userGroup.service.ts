import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private http: HttpClient) {}
  private readonly userApi =
    'http://localhost:3001/api/directory/user-group-management';

  private readonly dbGroup = 'http://localhost:8000/groupName';
  private readonly dbPermisstion = 'http://localhost:8000/permissionName';

  getAllUser(page: number, pageSize: number, keyword: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());
    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }
    return this.http.get<any[]>(this.userApi, { params });
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.userApi}/${id}`);
  }

  createUser(payload: any): Observable<any> {
    return this.http.post<any[]>(this.userApi, payload);
  }

  putUser(id: any, payload: any): Observable<any> {
    return this.http.put<any[]>(`${this.userApi}/${id}`, payload);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any[]>(`${this.userApi}/${id}`);
  }

  getAllGroupName(): Observable<any> {
    return this.http.get<any[]>(this.dbGroup);
  }
  getAllPermissionName(): Observable<any> {
    return this.http.get<any[]>(this.dbPermisstion);
  }
}

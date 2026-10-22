import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private http: HttpClient) {}
  private readonly userApi = 'http://localhost:3001/api/directory/user-group-management';

  getAllUser(): Observable<any> {
    return this.http.get<any[]>(this.userApi);
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.userApi}/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post<any[]>(this.userApi, data);
  }

  putUser(id: any, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.userApi}/${id}`, data);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any[]>(`${this.userApi}/${id}`);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}
  private readonly apiUrl =
    'http://localhost:3001/api/directory/user-management';
  getAllUsers(
    page: number,
    pageSize: number,
    keyword: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());
    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getUserById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(payload: any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl, payload);
  }

  updateUser(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

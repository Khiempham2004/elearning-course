import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:8080/users';
  getAllUsers(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: Number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUsers(payload: any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl, payload);
  }

  updateUser(id: any, payload: any): Observable<any> {
    return this.http.put<any[]>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}

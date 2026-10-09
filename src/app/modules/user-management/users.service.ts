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

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUsers(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}

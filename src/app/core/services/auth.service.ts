import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private readonly apiAuth = 'http://localhost:3001/api/auth';

  register(params: any): Observable<any> {
    return this.http.post<any>(`${this.apiAuth}/register`, params);
  }

  login(params: any): Observable<any> {
    return this.http.post<any>(`${this.apiAuth}/login`, params);
  }

  saveLoginData(res: any) {
    if (typeof res?.token !== 'string' || !res.token) {
      throw new Error('Phản hồi đăng nhập không có token hợp lệ');
    }
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getHomeForRole(role: string | null): string {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'directory':
        return '/directory';
      case 'teachers':
        return '/teachers';
      case 'students':
        return '/students';
      case 'courses':
        return '/courses';
      default:
        return '/login';
    }
  }
  getUserRole(): string | null {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(user);
      return typeof parsedUser.role === 'string' ? parsedUser.role : null;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

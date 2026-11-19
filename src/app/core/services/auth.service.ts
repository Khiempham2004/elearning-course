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

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiAuth}/me`);
  }

  updateProfile(params: {
    userName: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiAuth}/me`, params);
  }

  saveLoginData(res: any) {
    if (typeof res?.token !== 'string' || !res.token) {
      throw new Error('Phản hồi đăng nhập không có token hợp lệ');
    }
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    const identity = String(res.user?.id ?? res.user?._id ?? res.user?.userName ?? 'account');
    const roleLabels: Record<string, string> = {
      admin: 'Quản trị viên', teacher: 'Giảng viên', student: 'Học viên',
      directory: 'Quản lý danh mục', course: 'Quản lý khóa học',
    };
    const key = `notifications-${identity}`;
    let notifications: Array<{ id: string; message: string; createdAt: string; read: boolean }> = [];
    try {
      notifications = JSON.parse(localStorage.getItem(key) ?? '[]');
      if (!Array.isArray(notifications)) notifications = [];
    } catch { notifications = []; }
    notifications.unshift({
      id: `login-${Date.now()}`,
      message: `Đăng nhập thành công với vai trò ${roleLabels[res.user?.role] ?? res.user?.role ?? 'người dùng'}.`,
      createdAt: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem(key, JSON.stringify(notifications.slice(0, 30)));
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
      case 'teacher':
        return '/teacher';
      case 'student':
        return '/student';
      case 'course':
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

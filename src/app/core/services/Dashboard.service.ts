import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminDashboardData {
  totals: { students: number; teachers: number; courses: number; enrollments: number; pendingCourses: number };
  studentTrend: Array<{ year: number; month: number; label: string; count: number }>;
  enrollmentStatuses: Record<string, number>;
  latestCourses: Array<{ _id: string; courseCode: string; courseName: string; teacherName?: string; createdAt: string; status: boolean; approvalStatus?: string }>;
  revenue: null | { total: number };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly api = 'http://localhost:3001/api/admin/dashboard';
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<{ data: AdminDashboardData }> {
    return this.http.get<{ data: AdminDashboardData }>(this.api);
  }
}

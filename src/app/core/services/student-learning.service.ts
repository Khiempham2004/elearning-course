import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LearningCourse {
  _id: string;
  courseCode: string;
  courseName: string;
  category?: string;
  teacherName?: string;
  duration?: number;
  price?: number;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  enrollmentStatus?: 'active' | 'completed' | null;
  progress?: number;
}

export interface LearningActivity {
  _id: string;
  kind: 'schedule' | 'assignment' | 'exam';
  title: string;
  description?: string;
  startsAt?: string | null;
  dueAt?: string | null;
  durationMinutes?: number | null;
  location?: string;
  meetingUrl?: string;
  status?: 'published' | 'draft';
  courseId: LearningCourse;
  submission?: {
    answer: string;
    submittedAt: string;
    score?: number;
    feedback?: string;
  } | null;
  submissions?: Array<{
    studentId: { _id: string; userName: string; email: string } | string;
    answer: string;
    submittedAt: string;
    score?: number;
    feedback?: string;
  }>;
}

export interface MyLearning {
  student: { id: string; userName: string; email: string };
  enrollments: Array<{
    _id: string;
    status: string;
    progress: number;
    completedLessons: number;
    courseId: LearningCourse;
  }>;
  activities: LearningActivity[];
}

export interface LearningActivityPayload {
  courseId: string;
  kind: LearningActivity['kind'];
  title: string;
  description?: string;
  startsAt?: string | null;
  dueAt?: string | null;
  durationMinutes?: number | null;
  location?: string;
  meetingUrl?: string;
  status?: 'published' | 'draft';
}

@Injectable({ providedIn: 'root' })
export class StudentLearningService {
  private readonly api = 'http://localhost:3001/api/student-learning';
  constructor(private readonly http: HttpClient) {}

  getMyLearning(): Observable<{ data: MyLearning }> {
    return this.http.get<{ data: MyLearning }>(`${this.api}/me`);
  }

  getCatalog(): Observable<{ data: LearningCourse[] }> {
    return this.http.get<{ data: LearningCourse[] }>(`${this.api}/catalog`);
  }

  enroll(courseId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.api}/enroll/${courseId}`,
      {},
    );
  }

  submit(activityId: string, answer: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.api}/activities/${activityId}/submit`,
      { answer },
    );
  }

  getManageActivities(): Observable<{ data: { activities: LearningActivity[]; courses: LearningCourse[] } }> {
    return this.http.get<{ data: { activities: LearningActivity[]; courses: LearningCourse[] } }>(`${this.api}/activities/manage`);
  }

  createActivity(activity: LearningActivityPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/activities`, activity);
  }

  updateActivity(activityId: string, activity: LearningActivityPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/activities/${activityId}`, activity);
  }

  deleteActivity(activityId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/activities/${activityId}`);
  }

  grade(activityId: string, studentId: string, score: number, feedback: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/activities/${activityId}/submissions/${studentId}/grade`, { score, feedback });
  }
}

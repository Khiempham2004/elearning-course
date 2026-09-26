import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  constructor(private http: HttpClient) {}

  private readonly teacherApi = 'http://localhost:8000/lecturer';
  getAllTeachers(): Observable<any> {
    return this.http.get<any[]>(this.teacherApi);
  }

  getTeacherById(id: any): Observable<any> {
    return this.http.get<any[]>(`${this.teacherApi}/${id}`);
  }

  createTeacher(data: any): Observable<any> {
    return this.http.post<any[]>(this.teacherApi, data);
  }

  putTeacher(id: any, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.teacherApi}/${id}`, data);
  }

  deleteTeacher(id: any): Observable<any> {
    return this.http.delete<any[]>(`${this.teacherApi}/${id}`);
  }
}

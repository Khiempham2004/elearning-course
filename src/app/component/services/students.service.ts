import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}
  private readonly studentApi = 'http://localhost:3000/students';
  getAllStudents(): Observable<any> {
    return this.http.get<any[]>(this.studentApi);
  }

  getStudentById(id: any): Observable<any> {
    return this.http.get<any[]>(`${this.studentApi}/${id}`);
  }

  createStudent(data: any): Observable<any> {
    return this.http.post<any[]>(this.studentApi, data);
  }

  putStudents(id: any, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.studentApi}/${id}`, data);
  }

  deleteStudent(id: any): Observable<any> {
    return this.http.delete<any[]>(`${this.studentApi}/${id}`);
  }
}

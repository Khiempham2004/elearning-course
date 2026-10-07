import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor(private http: HttpClient) {}
  private readonly apiStudent = 'http://localhost:3001/api/student';

  getAllStudents(
    keyword: string = '',
    page: number = 1,
    pageSize: number = 10,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());
    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }
    return this.http.get<any[]>(this.apiStudent, { params });
  }

  getStudentById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiStudent}/${id}`);
  }

  createStudent(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiStudent, data);
  }

  putStudents(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiStudent}/${id}`, data);
  }

  deleteStudent(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiStudent}/${id}`);
  }

  getAllClass(): Observable<any> {
    return this.http.get<any[]>(this.apiStudent);
  }
}

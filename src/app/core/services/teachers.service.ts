import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  constructor(private http: HttpClient) {}

  // private readonly teacherApi = 'http://localhost:8000/lecturer';
  private readonly apiTeacher = 'http://localhost:3001/api/teacher';

  getAllTeachers(
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
    return this.http.get<any[]>(this.apiTeacher, { params });
  }

  getTeacherById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiTeacher}/${id}`);
  }

  createTeacher(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiTeacher, data);
  }

  putTeacher(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiTeacher}/${id}`, data);
  }

  deleteTeacher(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiTeacher}/${id}`);
  }
}

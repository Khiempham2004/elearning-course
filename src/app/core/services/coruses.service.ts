import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CorusesService {
  constructor(private http: HttpClient) {}
  private readonly coursesApi = 'http://localhost:9000/courses';

  getAllCourses(): Observable<any> {
    return this.http.get<any[]>(this.coursesApi);
  }

  getCourseById(id: any): Observable<any> {
    return this.http.get<any[]>(`${this.coursesApi}/${id}`);
  }

  createCourse(data: any): Observable<any> {
    return this.http.post<any[]>(this.coursesApi, data);
  }

  putCourse(id: any, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.coursesApi}/${id}`, data);
  }

  deleteCourse(id: any): Observable<any> {
    return this.http.delete<any[]>(`${this.coursesApi}/${id}`);
  }
}

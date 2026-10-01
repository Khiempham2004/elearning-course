import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CorusesService {
  constructor(private http: HttpClient) {}
  private readonly coursesApi = 'http://localhost:9000/courses';
  private readonly apiCourse = 'http://localhost:3001/api/course';

  getAllCourses(
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
    return this.http.get<any[]>(this.apiCourse, { params });
  }

  getCourseById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiCourse}/${id}`);
  }

  createCourse(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiCourse, data);
  }

  putCourse(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiCourse}/${id}`, data);
  }

  deleteCourse(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiCourse}/${id}`);
  }

  //search
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  constructor(private http: HttpClient) {}
  private apiSystem = 'http://localhost:3001/api/directory/system-management';
  getAllSystems(
    page: number,
    pageSize: number,
    keyword: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());
    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }
    return this.http.get<any>(this.apiSystem, { params });
  }

  getSystemById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiSystem}/${id}`);
  }

  createSystem(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiSystem, data);
  }

  updateSystem(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiSystem}/${id}`, data);
  }

  deleteSystem(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiSystem}/${id}`);
  }
}

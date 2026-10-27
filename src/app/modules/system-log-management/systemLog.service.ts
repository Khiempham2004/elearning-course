import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SystemLogService {
  constructor(private http: HttpClient) {}
  private readonly apiSystemLog =
    'http://localhost:3001/api/directory/system-log-management';

  getAllSystemLog(
    page: number,
    pageSize: number,
    keyword: string,
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }
    return this.http.get<any[]>(this.apiSystemLog , {params});
  }

  getSystemById(id: any): Observable<any[]> {
    return this.http.get<any>(`${this.apiSystemLog}/${id}`);
  }

  createSystemLog(payload: any): Observable<any> {
    return this.http.post<any[]>(this.apiSystemLog, payload);
  }

  putSystemLog(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiSystemLog}/${id}`, payload);
  }

  deleteSystemLog(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiSystemLog}/${id}`);
  }
}

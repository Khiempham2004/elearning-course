import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ProvinceLevelService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:3000/data';

  getAllProvinces(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProvinceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProvince(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl, data);
  }

  updateProvince(id: number, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.apiUrl}/${id}`, data);
  }

  deleteProvince(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}

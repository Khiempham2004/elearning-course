import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  constructor(private http: HttpClient) {}
  private apiSystem = 'http://localhost:9000/system';
  getAllSystems(): Observable<any> {
    return this.http.get<any[]>(this.apiSystem);
  }

  getSystemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiSystem}/${id}`);
  }

  createSystem(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiSystem, data);
  }

  updateSystem(id: number, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.apiSystem}/${id}`, data);
  }

  deleteSystem(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiSystem}/${id}`);
  }
}

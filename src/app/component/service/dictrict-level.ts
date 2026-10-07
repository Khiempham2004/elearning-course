import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictrictLevelService {
  constructor(private http: HttpClient) {}

  private readonly urlDictrict = 'http://localhost:9000/dictrict';
  getAllDictrict(): Observable<any> {
    return this.http.get<any[]>(this.urlDictrict);
  }

  getDictrictById(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlDictrict}/${id}`);
  }

  createDictrict(data: any): Observable<any> {
    return this.http.post<any[]>(this.urlDictrict, data);
  }

  updateDictrict(id: number, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.urlDictrict}/${id}`, data);
  }

  deleteDictrict(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.urlDictrict}/${id}`);
  }
}

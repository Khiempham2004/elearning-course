import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private readonly http: HttpClient) {}
  // private readonly url = 'http://localhost:8000/data';
  private readonly apiUrl =
    'http://localhost:3001/api/directory/multi-level-management';

  getAllRooms(
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
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRoom(data: any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl, data);
  }

  updateRoom(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

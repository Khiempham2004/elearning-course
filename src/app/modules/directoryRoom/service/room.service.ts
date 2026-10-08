import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private readonly http: HttpClient) {}
  private readonly url = 'http://localhost:8000/data';

  getAllRooms(): Observable<any> {
    return this.http.get<any[]>(this.url);
  }

  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  createRoom(data: any): Observable<any> {
    return this.http.post<any[]>(this.url, data);
  }

  updateRoom(id: number, data: any): Observable<any> {
    return this.http.put<any[]>(`${this.url}/${id}`, data);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.url}/${id}`);
  }
}

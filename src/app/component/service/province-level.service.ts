import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProvinceLevelService {
  private readonly apiUrl = 'http://localhost:3001/api/province';

  constructor(private http: HttpClient) {}

  private unwrap(response: any): any {
    const data = response?.data;
    if (Array.isArray(data))
      return data.map((item) => ({ ...item, id: item._id }));
    return data ? { ...data, id: data._id } : data;
  }

  getAllProvinces(
    page: number,
    limit: number,
    keyword: string,
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}`, {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          q: keyword,
        },
      })
      .pipe(
        map((response) => ({
          ...response,
          data: this.unwrap(response),
        })),
      );
  }

  getProvinceById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => this.unwrap(response)));
  }

  createProvince(data: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, data)
      .pipe(map((response) => this.unwrap(response)));
  }

  updateProvince(id: string, data: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(map((response) => this.unwrap(response)));
  }

  deleteProvince(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => this.unwrap(response)));
  }
}

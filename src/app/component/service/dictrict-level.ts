import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DictrictLevelService {
  constructor(private http: HttpClient) {}

  private readonly urlDictrict = 'http://localhost:3001/api/district';

  private unwrap(response: any): any {
    const data = response?.data;
    if (Array.isArray(data))
      return data.map((item) => ({ ...item, id: item._id }));
    return data ? { ...data, id: data._id } : data;
  }

  getAllDictrict(
    page: number,
    limit: number,
    keyword: string,
  ): Observable<any> {
    return this.http
      .get<any>(`${this.urlDictrict}`, {
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

  getDictrictById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.urlDictrict}/${id}`)
      .pipe(map((response) => this.unwrap(response)));
  }

  createDictrict(data: any): Observable<any> {
    return this.http
      .post<any>(this.urlDictrict, data)
      .pipe(map((response) => this.unwrap(response)));
  }

  updateDictrict(id: string, data: any): Observable<any> {
    return this.http
      .put<any>(`${this.urlDictrict}/${id}`, data)
      .pipe(map((response) => this.unwrap(response)));
  }

  deleteDictrict(id: string): Observable<any> {
    return this.http
      .delete<any>(`${this.urlDictrict}/${id}`)
      .pipe(map((response) => this.unwrap(response)));
  }
}

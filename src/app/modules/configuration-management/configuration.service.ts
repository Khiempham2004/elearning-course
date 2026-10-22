import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private readonly http: HttpClient) {}
  // private configurationApi = 'http://localhost:9000/systemConfigs';
  private readonly apiUrl =
    'http://localhost:3001/api/directory/configuration-management';

  getAllConfiguration(
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

  getConfigurationById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createConfiguration(payload: any): Observable<any> {
    return this.http.post<any[]>(this.apiUrl, payload);
  }

  putConfiguration(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteConfiguration(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

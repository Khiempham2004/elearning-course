import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private readonly http: HttpClient) {}
  private configurationApi = 'http://localhost:9000/systemConfigs';

  getAllConfiguration(): Observable<any[]> {
    return this.http.get<any[]>(this.configurationApi);
  }

  getConfigurationById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.configurationApi}/${id}`);
  }

  createConfiguration(payload: any): Observable<any> {
    return this.http.post<any>(this.configurationApi, payload);
  }

  putConfiguration(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.configurationApi}/${id}`, payload);
  }

  deleteConfiguration(id: any): Observable<any> {
    return this.http.delete<any>(`${this.configurationApi}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VenziaDatalinkRestService {
  constructor(private http: HttpClient) {}

  callApi(endpoint: string, params?: any, authdata?: string): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Basic ${authdata}` }), params: {} };

    if (params) {
      httpOptions.params = params;
    }

    return this.http.get(endpoint, httpOptions).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    const body = res;
    return body || [];
  }
}

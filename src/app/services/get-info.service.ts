import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetInfoService {
  baseUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) { }

  public getInfo(data: {email: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'getinfo', data, {headers: headers});
  }
}

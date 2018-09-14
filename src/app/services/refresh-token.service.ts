import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private http: HttpClient) { }

  public getAccessToken(refreshToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + refreshToken);
    return this.http.post('http://localhost:5000/api/refresh', {}, {headers: headers});
  }
}

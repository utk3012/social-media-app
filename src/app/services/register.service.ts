import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  baseUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) { }

  public onRegister(data: any) {
    return this.http.post(this.baseUrl + 'register', data);
  }

  public onLogin(data: any) {
    return this.http.post(this.baseUrl + 'login', data);
  }
}

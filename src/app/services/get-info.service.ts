import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators';
import { of } from 'rxjs/index';

import { RefreshTokenService } from './refresh-token.service';

@Injectable({
  providedIn: 'root'
})
export class GetInfoService {
  baseUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient, private refreshTokenService: RefreshTokenService) { }

  public getInfo(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'getinfo', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('error111');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public getAllUsers(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'discover', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public getFriends(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'friends', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public getPosts(data: {fromUsername: string, forUsername: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_posts', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public savePost(data: any, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'make_post', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public getFriendPosts(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_friend_posts', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public sendRequest(data: {fromUsername: string, forUsername: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'send_request', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public acceptRequest(data: {fromUsername: string, forUsername: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'accept_request', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public getRequests(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_requests', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public getMessages(data: {username: string, dts: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_messages', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }

  public onLike(data: {username: string, post_id}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'like_post', data, {headers: headers}).pipe(
      catchError((error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
              }
            });
          return of();
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetInfoService {
  baseUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) { }

  public getInfo(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'getinfo', data, {headers: headers});
  }

  public getAllUsers(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'discover', data, {headers: headers});
  }

  public getFriends(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'friends', data, {headers: headers});
  }

  public getPosts(data: {fromUsername: string, forUsername: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_posts', data, {headers: headers});
  }

  public savePost(data: any, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'make_post', data, {headers: headers});
  }

  public getFriendPosts(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_friend_posts', data, {headers: headers});
  }

  public sendRequest(data: {fromUsername: string, forUsername: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'send_request', data, {headers: headers});
  }

  public acceptRequest(data: {fromUsername: string, forUsername: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'accept_request', data, {headers: headers});
  }

  public getRequests(data: {username: string}, accessToken: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + accessToken);
    return this.http.post(this.baseUrl + 'get_requests', data, {headers: headers});
  }
}

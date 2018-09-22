import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { GetInfoService } from '../services/get-info.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { UserInfo } from '../models/UserInfo-Model';
import { Post } from '../models/Post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userInfo: UserInfo
    = {name: '', info: '', place: '', birthday: '', image: ''};
  dataSuccess = 0;
  posts: Post[];

  constructor(private getInfoService: GetInfoService, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    this.getInfoService.getInfo({username: username}, accessToken)
      .subscribe((data: {name: string, info: string, place: string, birthday: string, image: string, success: number}) => {
        if (data.success === 1) {
          delete data.success;
          this.userInfo = Object.assign({}, data);
          this.dataSuccess = 1;
        }
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                this.ngOnInit();
              }
          });
        }
      });

    this.getInfoService.getFriendPosts({username: username}, accessToken)
      .subscribe((data: any) => {
        if (data.success === 1) {
          this.posts = data.data;
          this.posts.sort(function compare(a, b) {
            let dateA = new Date(a.post_date);
            let dateB = new Date(b.post_date);
            return dateB - dateA;
          });
        }
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                this.ngOnInit();
              }
            });
        }
      });

  }

  makePost(form: NgForm) {
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const now = new Date().toISOString().split('.')[0];
    const publ = form.value.public ? 1 : 0;
    this.getInfoService.savePost({username: username, post: form.value.post, post_date: now, liked: 0, public: publ}, accessToken)
      .subscribe((data: {msg: string, success: number}) => {
        if (data.success === 1) {
          form.reset();
        }
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          this.refreshTokenService.getAccessToken(refreshToken)
            .subscribe((data: {accessToken: string}) => {
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                this.ngOnInit();
              }
            });
        }
      });
  }

}

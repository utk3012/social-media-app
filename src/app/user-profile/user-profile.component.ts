import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetInfoService } from '../services/get-info.service';
import { UserInfo } from '../models/UserInfo-Model';
import { Post } from '../models/Post.model';
import { RefreshTokenService } from '../services/refresh-token.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  forUsername: string;
  userInfo: UserInfo = {name: '', info: '', place: '', birthday: '', image: ''};
  dataSuccess = 0;
  posts: Post[];
  foreignProfile = false;
  friendProfile = false;
  relationStatus = -1;
  myId: number;

  constructor(private activatedRoute: ActivatedRoute, private getInfoService: GetInfoService,
              private router: Router, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    const fromUsername = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    this.activatedRoute.params
      .subscribe((queryParams: Params) => {
        this.forUsername = queryParams['username'];
        this.foreignProfile = this.forUsername != fromUsername;
        this.getInfoService.getInfo({username: this.forUsername}, accessToken)
          .subscribe((data: {name: string, info: string, place: string, birthday: string, image: string, success: number}) => {
            if (data.success === 1) {
              delete data.success;
              this.userInfo = Object.assign({}, data);
              this.dataSuccess = 1;
            }
            else if (data.success === 0 && data.name === 'not-found') {
              this.router.navigate(['/not-found']);
            }
          }, (error) => {
            if (error.status === 422 || error.error.msg === 'Token has expired') {
              const refreshToken = localStorage.getItem('refreshToken');
              console.log('Token expired.');
              this.refreshTokenService.getAccessToken(refreshToken)
                .subscribe((data: {accessToken: string}) => {
                  if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    this.ngOnInit();
                  }
                });
            }
          });

        this.getInfoService.getPosts({forUsername: this.forUsername, fromUsername: fromUsername}, accessToken)
          .subscribe((data: any) => {
            if(data.success) {
              this.friendProfile = data.friends;
              this.posts = data.data;
              this.myId = data.myid;
              this.relationStatus = data.status;
            }
          }, (error) => {
            if (error.status === 422 || error.error.msg === 'Token has expired') {
              const refreshToken = localStorage.getItem('refreshToken');
              console.log('Token expired.');
              this.refreshTokenService.getAccessToken(refreshToken)
                .subscribe((data: {accessToken: string}) => {
                  if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    this.ngOnInit();
                  }
                });
            }
          });
      });
  }

  sendRequest() {
    const fromUsername = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    this.getInfoService.sendRequest({forUsername: this.forUsername, fromUsername: fromUsername}, accessToken)
      .subscribe((data: any) => {
        if(data.success) {
          this.relationStatus = 1;
        }
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired.');
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

  acceptRequest() {
    const fromUsername = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    this.getInfoService.acceptRequest({forUsername: this.forUsername, fromUsername: fromUsername}, accessToken)
      .subscribe((data: any) => {
        if(data.success) {
          this.friendProfile = true;
        }
      }, (error) => {
        if (error.status === 422 || error.error.msg === 'Token has expired') {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log('Token expired.');
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetInfoService } from '../services/get-info.service';
import { RefreshTokenService } from '../services/refresh-token.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  users: any[];
  showMess = false;
  username: string;

  constructor(private getInfoService: GetInfoService, private router: Router, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    this.username = localStorage.getItem('username');
    this.getInfoService.getFriends({username: this.username}, accessToken)
      .subscribe((dat: {success: number, data: any}) => {
        if (dat.success === 1) {
          this.users = dat.data;
        } else {
          this.users = []
        }
        this.showMess = true;
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

  viewUser(username: string) {
    this.router.navigate(['/', username]);
  }
}

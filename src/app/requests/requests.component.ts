import { Component, OnInit } from '@angular/core';
import { GetInfoService } from '../services/get-info.service';
import { Router } from '@angular/router';
import { RefreshTokenService } from '../services/refresh-token.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  users: any[];
  showMess = false;
  username: string;

  constructor(private getInfoService: GetInfoService, private router: Router, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');
    this.username = localStorage.getItem('username');
    this.getInfoService.getRequests({username: this.username}, accessToken)
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

  acceptRequest(forUsername) {
    const fromUsername = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    this.getInfoService.acceptRequest({forUsername: forUsername, fromUsername: fromUsername}, accessToken)
      .subscribe((data: any) => {
        if(data.success) {
          this.viewUser(forUsername);
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

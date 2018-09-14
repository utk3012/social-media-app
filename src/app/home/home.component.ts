import { Component, OnInit } from '@angular/core';
import { GetInfoService } from '../services/get-info.service';
import { RefreshTokenService } from '../services/refresh-token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userInfo: {name: string, info: string, place: string, birthday: string, image: string, success: number}
    = {name: '', info: '', place: '', birthday: '', image: '', success: 0};

  constructor(private getInfoService: GetInfoService, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    this.userInfo.success = 0;
    const accessToken = localStorage.getItem('accessToken');
    const userEmail = localStorage.getItem('userEmail');
    this.getInfoService.getInfo({email: userEmail}, accessToken)
      .subscribe((data: {name: string, info: string, place: string, birthday: string, image: string, success: number}) => {
        if (data.success === 1) {
          this.userInfo = Object.assign({}, data);
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

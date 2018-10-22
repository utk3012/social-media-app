import { Component, OnInit } from '@angular/core';
import { GetInfoService } from '../services/get-info.service';
import { RefreshTokenService } from '../services/refresh-token.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  showMess = false;
  notifications: {notification: string, time_stamp: string}[];
  
  constructor(private getInfoService: GetInfoService, private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');
    this.getInfoService.getNotifications({username: username}, accessToken)
    .subscribe((dat: {success: number, data: any}) => {
      if (dat.success === 1) {
        this.notifications = dat.data;
        this.notifications.sort(function compare(a, b) {
          const date1 = a.time_stamp != null ? new Date(a.time_stamp).getTime() : 0;
          const date2 = b.time_stamp != null ? new Date(b.time_stamp).getTime() : 0;
          return date2 - date1;
        });
      } else {
        this.showMess = true;
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

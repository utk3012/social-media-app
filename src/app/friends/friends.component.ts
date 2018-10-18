import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetInfoService } from '../services/get-info.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  users: any[];
  showMess = false;
  username: string;

  constructor(private getInfoService: GetInfoService, private router: Router) { }

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
        console.log(error);
      });
  }

  viewUser(username: string) {
    this.router.navigate(['/', username]);
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string;
  showNavSmall = false;

  constructor() { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
  }

  toggleNav() {
    this.showNavSmall = !this.showNavSmall;
  }

}

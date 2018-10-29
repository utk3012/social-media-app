import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    const refreshToken = localStorage.getItem('refreshToken');
    if(!refreshToken) {
      this.router.navigate(['/', 'login']);
      return false;
    }
    return true;
  }
}

import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showError = false;

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const val = form.value;
    if (val.email.length < 5 || val.password.length < 5) {
      this.showError = true;
      return;
    }
    this.registerService.onLogin(form.value)
      .subscribe((data: {accessToken: string, refreshToken: string, success: number, msg: string, username: string}) => {
        if (data.success === 1) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('username', data.username);
          form.reset();
          this.router.navigate(['/home']);
        } else {
          form.reset();
          this.showError = true;
        }
      });
  }

}

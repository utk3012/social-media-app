import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showError = false;

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const val = form.value;
    if (val.email.length < 5 || val.name.length < 3 || val.place.length < 3
      || val.birthday.length < 5 || val.password.length < 5 || val.info.length < 5) {
      this.showError = true;
      return;
    }
    this.registerService.onRegister(form.value)
      .subscribe((data: {accessToken: string, refreshToken: string, success: number, msg: string}) => {
        if (data.success === 1) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('userEmail', val.email);
          form.reset();
          this.router.navigate(['/home']);
        } else {
          form.reset();
          this.showError = true;
        }
      });
  }

}

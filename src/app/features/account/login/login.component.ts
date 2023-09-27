import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';
  constructor(private router: Router, private apiService: ApiService) {}
  ngOnInit(): void {}
  navigateToHome() {
    const apiRequest = {
      data: {
        email: this.userName,
        password: this.password,
      },
    };
  }
}

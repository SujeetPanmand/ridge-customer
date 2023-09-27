import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {}
  navigateToHome() {
    const apiRequest = {
      data: {
        email: this.userName,
        password: this.password,
      },
    };

    this.apiService.request('USER_LOGIN', apiRequest).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.toastrService.success('User Logged In Successfully!');
        this.router.navigate[''];
      } else {
        this.toastrService.error(res.message);
      }
    });
  }
}

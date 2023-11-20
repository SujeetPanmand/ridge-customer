import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userName: string = '';
  password: string = '';
  formSubmitAttempt: boolean = false;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.generateLoginForm();
  }

  generateLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }

  navigateToHome() {
    this.formSubmitAttempt = true;
    if (this.loginForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        email: this.userName,
        password: this.password,
        featureForAdmin: false,
      },
    };

    this.apiService.request('USER_LOGIN', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.setUserBasics(res.userDetails);
        this.toastrService.success('User Logged In Successfully!');
        this.router.navigate(['home']);
        this.commonService.getUserDetails();
      } else {
        this.toastrService.error(res.message);
      }
    });
  }

  setUserBasics(userDetails) {
    localStorage.setItem('token', userDetails.token);
    localStorage.setItem('userName', this.userName);
    localStorage.setItem('userId', userDetails.id);
    this.setUserProfilePic(userDetails.id);
  }
  setUserProfilePic(userId) {
    this.commonService.profilePictureUrl =
      userId != null && userId != ''
        ? environment.baseUrl + '/api/user/image/' + userId
        : 'assets/em_user.png';
  }

  isFieldValid = (formGroup: FormGroup, field: string): boolean =>
    formGroup.get(field).invalid &&
    (this.formSubmitAttempt || formGroup.get(field).touched);

  hasError = (
    formGroup: FormGroup,
    field: string,
    errorName: string
  ): boolean =>
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  formSubmitAttempt: boolean = false;
  userName: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  zipCode: string = '';
  phoneNumber: string = '';
  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.generateSignUpForm();
  }

  generateSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  navigateToHome() {
    this.formSubmitAttempt = true;
    if (this.signUpForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        email: this.userName,
        password: this.password,
        fullName: this.firstName + ' ' + this.lastName,
        address: this.address,
        zipCode: this.zipCode,
        phoneNumber: this.phoneNumber,
      },
    };

    this.apiService.request('USER_SIGN_UP', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      if (res && res.statusCode == 201) {
        this.toastrService.success('User Created Successfully.');
        this.router.navigate(['login']);
      } else {
        this.toastrService.error(res.message);
      }
    });
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

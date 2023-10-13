import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit {
  myAccountForm: FormGroup;
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  phone: string = '';
  myAccountFormSubmitAttempt: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.saveMyAccountForm();
  }

  saveMyAccountForm() {
    this.myAccountForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  updateMyAccountInfo() {
    this.myAccountFormSubmitAttempt = true;
    if (this.myAccountForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddress: this.emailAddress,
        phone: this.phone,
      },
    };
    this.apiService
      .request('UPDATE_ACCOUNT_INFO', apiRequest)
      .subscribe((res) => {
        this.myAccountFormSubmitAttempt = false;
        if (res && res.statusCode == 200) {
          // this.setUserBasics(res.userDetails);
          this.toastrService.success('Updated Successfully!');
        } else if (res.statusCode == 501) {
          this.toastrService.error('Token Expire');
        } else {
          this.toastrService.error(res.message);
        }
      });
  }

  isFieldValid = (formGroup: FormGroup, field: string): boolean =>
    formGroup.get(field).invalid &&
    (this.myAccountFormSubmitAttempt || formGroup.get(field).touched);

  hasError = (
    formGroup: FormGroup,
    field: string,
    errorName: string
  ): boolean =>
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;
}

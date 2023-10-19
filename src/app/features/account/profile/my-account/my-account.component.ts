import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/interfaces/user/user-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { links } from '../profile.config';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';

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
  userDetails: User;
  links: BreadCrumbLinks[] = links;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.saveMyAccountForm();
    this.defaultSetting();
  }

  saveMyAccountForm() {
    this.myAccountForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  defaultSetting() {
    this.commonService.getUserDetails().then((res) => {
      this.userDetails = res;
      console.log('___', this.userDetails);
      this.patchUserDetails();
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
        email: this.emailAddress,
        phoneNumber: this.phone,
      },
    };
    this.apiService
      .request('UPDATE_ACCOUNT_INFO', apiRequest)
      .subscribe((res) => {
        this.myAccountFormSubmitAttempt = false;
        if (res && res.statusCode == 200) {
          this.toastrService.success('Updated Successfully!');
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

  patchUserDetails() {
    this.myAccountForm.patchValue({
      firstName: this.userDetails.userDetails.fullName.split(' ')[0],
      lastName: this.userDetails.userDetails.fullName.split(' ')[1],
      emailAddress: this.userDetails.userDetails.email,
      phone: this.userDetails.userDetails.phoneNumber,
    });
  }
}

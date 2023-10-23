import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/interfaces/user/user-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { myAccountlinks } from '../profile.config';

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
  links: BreadCrumbLinks[] = myAccountlinks;
  profilePictureUrl = 'assets/em_user.png';
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
  onSelectFile = (event) => {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(event.target.value)) {
      this.toastrService.error(
        '  "Upload only .jpg, .jpeg and .png file format"',
        '',
        {
          positionClass: 'toast-bottom-right',
        }
      );
    } else {
      if (event.target.files && event.target.files[0]) {
        this.uploadProfilePicture(event.target.files[0]);
        event.target.value = '';
      }
    }
  };

  uploadProfilePicture = (file: any) => {
    const formdata = new FormData();

    formdata.append('file', file);
    formdata.append('referenceKey', this.userDetails.userDetails.email);
    this.loadUrl(file);
    const apiRequest = { data: formdata };
    this.apiService
      .request('EDIT_PROFILE_IMAGE', apiRequest)
      .subscribe((res) => {
        if (res.statusCode === 200) {
          this.profilePictureUrl = '';
          this.loadUrl(file);
        }
      });
  };

  private loadUrl(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event: any) => {
      this.profilePictureUrl = event.target.result;
    };
  }
}

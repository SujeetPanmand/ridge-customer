import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { ZipCodeDetails } from 'src/app/shared/interfaces/zipcode/zipcode-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

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
  state: string = '';
  phoneNumber: string = '';
  city: string = '';
  country: string = '';
  zipCodeDetails: ZipCodeDetails;
  zipCodeChanged = new Subject<string>();
  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.onZipCodeChanged();
    this.commonService.gotoTop();
  }

  ngOnInit() {
    this.generateSignUpForm();
  }

  onKeyPress(event) {
    console.log(event.keyCode);
    if (
      this.zipCode &&
      this.zipCode.toString().length >= 5 &&
      !(event.keyCode == 8)
    ) {
      event.preventDefault();
    }
  }

  onZipCodeChanged() {
    this.zipCodeChanged.pipe(debounceTime(1000)).subscribe((value) => {
      if (value) {
        this.apiService
          .request('GET_ZIPCODE_DETAILS', {
            params: { zipcode: value },
          })
          .subscribe((res) => {
            if (res && res.statusCode == 200) {
              this.zipCodeDetails = res;
              console.log(this.zipCodeDetails.zipCodeDetails.zipcode);
              this.patchDataFromZipCode(this.zipCodeDetails);
            } else {
              this.toastrService.error('Please enter a correct zipcode.');
            }
          });
      }
    });
  }

  patchDataFromZipCode(zipCodeDetails: ZipCodeDetails) {
    this.signUpForm.patchValue({
      city: zipCodeDetails.zipCodeDetails.city,
      state: zipCodeDetails.zipCodeDetails.state,
      country: zipCodeDetails.zipCodeDetails.country,
    });
  }

  generateSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      password: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  navigateToHome() {
    this.formSubmitAttempt = true;
    if (this.signUpForm.invalid) {
      if (
        this.userName &&
        this.signUpForm.controls['email'].errors['pattern']
      ) {
        this.showErrorMessage('Your email is incorrect.');
      }
      return;
    }
    const apiRequest = {
      data: {
        email: this.userName,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        zipCode: this.zipCode.toString(),
        phoneNumber: this.phoneNumber.toString(),
        state: this.state,
        city: this.city,
        country: this.country,
      },
    };

    this.apiService.request('USER_SIGN_UP', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.toastrService.success('User Created Successfully.');
        this.router.navigate(['account/login']);
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

  showErrorMessage(msg) {
    this.toastrService.error(msg);
  }
}

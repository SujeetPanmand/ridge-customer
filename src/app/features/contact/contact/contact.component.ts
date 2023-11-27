import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  userEmail: string = '';
  subject: string = '';
  message: string = '';
  formSubmitAttempt: boolean = false;
  // isEmailFieldDisabled: boolean = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.generateContactForm();
    this.commonService.gotoTop();
    this.commonService.getUserDetails().then((x) => {
      this.userEmail = x.userDetails.email;
      this.contactForm.get('userEmail').disable();
    });
  }
  generateContactForm() {
    this.contactForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  navigateToHome() {
    this.formSubmitAttempt = true;
    if (this.contactForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        userEmail: this.userEmail,
        subject: this.subject,
        message: this.message,
      },
    };
    this.apiService.request('CONTACT_US', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.toastrService.success('Contact Added Successfully!');
        this.router.navigate(['home']);
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

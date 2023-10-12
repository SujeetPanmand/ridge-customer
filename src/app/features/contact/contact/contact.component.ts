import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';

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
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.generateContactForm();
  }
  generateContactForm() {
    this.contactForm = this.formBuilder.group({
      userEmail: ['', Validators.required],
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
        // this.setUserBasics(res.userDetails);
        this.toastrService.success('Contact Added Successfully!');
        this.router.navigate(['']);
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
    formGroup.get(field).errors
      ? formGroup.get(field).errors[errorName]
      : false;
}

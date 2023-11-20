import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  subscribeForm: FormGroup;
  emailSubscribe: string = "";
  formSubmitAttempt: boolean = false;

  constructor(private commonService: CommonService, private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService) { }
  ngOnInit(): void {
    this.commonService.gotoTop();
    this.generateSubscribeForm();
    this.commonService.getUserDetails().then(x => {
      this.emailSubscribe = x.userDetails.email;
      this.subscribeForm.get('emailSubscribe').disable();
    })
  }
  generateSubscribeForm() {
    this.subscribeForm = this.formBuilder.group({
      emailSubscribe: ['', [Validators.required, Validators.email]],
    });
  }
  
  navigateToHome() {
    this.formSubmitAttempt = true;
    if (this.subscribeForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        subscribeEmail: this.emailSubscribe,
      },
    };
    this.apiService.request('EMAIL_SUBSCRIBE', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        // this.setUserBasics(res.userDetails);
        this.toastrService.success('Subscribe Successfully!');
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
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;

}

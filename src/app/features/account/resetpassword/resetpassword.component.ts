import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
})
export class ResetpasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isSubmitted: boolean = false;
  resetPasswordUrl: any;
  resetPasswordToken: string = '';

  constructor(
    private router: Router,
    private active_route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.resetPassword();
    this.resetPasswordUrl = this.router.url;
    this.active_route.queryParams.subscribe((queryParams) => {
      if (
        queryParams['token'] &&
        this.resetPasswordUrl.includes('resetpassword')
      ) {
        this.resetPasswordToken = queryParams['token'];
      }
    });
  }

  get passwordMatchError() {
    return (
      this.resetPasswordForm.getError('mismatch') &&
      this.resetPasswordForm.get('confirmPassword')?.touched
    );
  }

  resetPassword() {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    debugger;
    if (this.resetPasswordForm.valid && this.resetPasswordToken != '') {
      const apiRequest = {
        data: {
          token: this.resetPasswordToken,
          newPassword: this.resetPasswordForm.get('newPassword')?.value,
          confirmPassword: this.resetPasswordForm.get('confirmPassword')?.value,
        },
      };

      this.apiService
        .request('RESET_PASSWORD', apiRequest)
        .subscribe((response) => {
          if (response && response.statusCode === 200) {
            this.toastrService.success(response?.message);
            this.router.navigate(['account/login']);
          } else {
            this.toastrService.error(response?.message);
          }
        });
    }
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const apiRequest = {
        data: {
          featureForAdmin: false,
          email: this.form?.get('email')?.value,
        },
      };

      this.apiService
        .request('FORGOT_PASSWORD', apiRequest)
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

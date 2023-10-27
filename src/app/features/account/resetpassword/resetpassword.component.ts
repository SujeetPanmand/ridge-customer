import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  pageTitle = "Reset Password";
  isSubmitted: boolean = false;
  isAcceptInvitation:boolean= false;
  constructor() { }

  ngOnInit() {
    this.forgotPassword();
  }
  
  get passwordMatchError() {
    return (
      this.resetPasswordForm.getError('mismatch') &&
      this.resetPasswordForm.get('confirmpassword')?.touched
    );
  }

  forgotPassword() {
    this.resetPasswordForm = new FormGroup(
      {
        newpassword: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          ),
        ]),
        confirmpassword: new FormControl('', [Validators.required,]),
      },
    );
  }

  onSubmit() {
  }

}

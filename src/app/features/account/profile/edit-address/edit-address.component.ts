import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  editAddressForm: FormGroup;
  editAddressFormSubmitAttempt: boolean = false;
  countryRegion: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  townCity: string = '';
  zipCode: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.saveEditAddressForm();
  }

  saveEditAddressForm() {
    this.editAddressForm = this.formBuilder.group({
      countryRegion: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      townCity: ['', Validators.required],
      zipCode: ['', Validators.required],
    });
  }

  
  updateEditAddress() {
    this.editAddressFormSubmitAttempt = true;
    if (this.editAddressForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        countryRegion: this.countryRegion,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2,
        townCity: this.townCity,
        zipCode: this.zipCode
      },
    };
    this.apiService
      .request('UPDATE_ADDRESS', apiRequest)
      .subscribe((res) => {
        this.editAddressFormSubmitAttempt = false;
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
  ( this.editAddressFormSubmitAttempt ||
    formGroup.get(field).touched);

    

  hasError = (
    formGroup: FormGroup,
    field: string,
    errorName: string
  ): boolean =>
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;

}

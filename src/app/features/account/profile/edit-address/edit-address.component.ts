import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { User } from 'src/app/shared/interfaces/user/user-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { myAddressLinks } from '../profile.config';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css'],
})
export class EditAddressComponent implements OnInit {
  editAddressForm: FormGroup;
  editAddressFormSubmitAttempt: boolean = false;
  countryRegion: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  townCity: string = '';
  zipCode: string = '';
  userDetails: User;
  state: string = '';
  links: BreadCrumbLinks[] = myAddressLinks;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.saveEditAddressForm();
    this.defaultSetting();
  }

  saveEditAddressForm() {
    this.editAddressForm = this.formBuilder.group({
      countryRegion: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      townCity: ['', Validators.required],
      zipCode: ['', Validators.required],
      state: ['', Validators.required],
    });
  }

  defaultSetting() {
    this.commonService.getUserDetails().then((res) => {
      this.userDetails = res;
      console.log('___', this.userDetails);
      this.patchUserDetails();
    });
  }

  updateEditAddress() {
    this.editAddressFormSubmitAttempt = true;
    if (this.editAddressForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        address1: this.addressLine1,
        address2: '',
        zipCodeId: '',
        zipCode: this.zipCode,
        hideAddressFromPublic: true,
        country: this.countryRegion,
        city: this.townCity,
        state: this.state,
        stateAbbreviation: '',
        latitude: 0,
      },
    };
    this.apiService.request('UPDATE_ADDRESS', apiRequest).subscribe((res) => {
      this.editAddressFormSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.toastrService.success('Updated Successfully!');
      }
    });
  }

  isFieldValid = (formGroup: FormGroup, field: string): boolean =>
    formGroup.get(field).invalid &&
    (this.editAddressFormSubmitAttempt || formGroup.get(field).touched);

  hasError = (
    formGroup: FormGroup,
    field: string,
    errorName: string
  ): boolean =>
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;

  patchUserDetails() {
    this.editAddressForm.patchValue({
      addressLine1: this.userDetails.userDetails.addressList[0].addressLine,
      townCity: this.userDetails.userDetails.addressList[0].city,
      countryRegion: this.userDetails.userDetails.addressList[0].country,
      zipCode: this.userDetails.userDetails.addressList[0].postalCode,
      state: this.userDetails.userDetails.addressList[0].state,
    });
  }
}

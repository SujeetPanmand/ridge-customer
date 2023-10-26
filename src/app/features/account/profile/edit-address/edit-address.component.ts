import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { User } from 'src/app/shared/interfaces/user/user-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { myAddressLinks } from '../profile.config';
import { ZipCodeDetails } from 'src/app/shared/interfaces/zipcode/zipcode-details';

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
  zipCodeDetails: ZipCodeDetails;
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
        address2: this.addressLine2,
        zipCodeId: this.zipCodeDetails.zipCodeDetails.id,
        zipCode: this.zipCode,
        hideAddressFromPublic: true,
        country: this.countryRegion,
        city: this.townCity,
        state: this.state,
        stateAbbreviation: this.zipCodeDetails.zipCodeDetails.stateAbbreviation,
        latitude: this.zipCodeDetails.zipCodeDetails.latitude,
        longitude: this.zipCodeDetails.zipCodeDetails.longitude,
        county:this.zipCodeDetails.zipCodeDetails.county
      },
    };
    this.apiService.request('UPDATE_ADDRESS', apiRequest).subscribe((res) => {
      this.editAddressFormSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.toastrService.success('Updated Successfully!');
      }
    });
  }

  checkZipCode(){
    if(this.zipCode.length >= 5){
      this.fetchZipCodeDetails(this.zipCode);
    }
  }

  async fetchZipCodeDetails(zipcode){
    await this.apiService
      .request('GET_ZIPCODE_DETAILS', {
        params: { zipcode: zipcode },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.zipCodeDetails = res;
          console.log(this.zipCodeDetails.zipCodeDetails.zipcode);
          this.setZipCodeDetails(this.zipCodeDetails);
        } else {
          this.toastrService.error(res.message)
        }
      });
  }

  setZipCodeDetails(zipCodeDetails: ZipCodeDetails){
    this.editAddressForm.patchValue({
      zipCode: zipCodeDetails.zipCodeDetails.zipcode,
      townCity: zipCodeDetails.zipCodeDetails.city,
      state: zipCodeDetails.zipCodeDetails.state,
      countryRegion: zipCodeDetails.zipCodeDetails.country
    })
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
      addressLine1: this.userDetails.userDetails.addressList[0]['address1'],
      addressLine2: this.userDetails.userDetails.addressList[0]['address2'],
      townCity: this.userDetails.userDetails.addressList[0].city,
      countryRegion: this.userDetails.userDetails.addressList[0].country,
      zipCode: this.userDetails.userDetails.addressList[0].postalCode,
      state: this.userDetails.userDetails.addressList[0].state,
    });
    this.fetchZipCodeDetails(this.zipCode);
  }
}

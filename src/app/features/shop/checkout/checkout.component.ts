import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user/user-details';
import { CommonService } from 'src/app/shared/services/common.service';
import { dayList } from '../shop.config';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  TAX_AMOUNT = 70;
  SHIPPING_AMOUNT = 40;
  isSelfPickUp = false;
  finalOrderProducts = [];
  orderTotal = 0;
  orderSubTotal = 0;
  isStandardCut = false;
  userDetailsForm: FormGroup;
  userDetails: User;
  todayDate = '';
  selectedDate = '';
  selectedDay = '';
  dayList = dayList;
  allSlots = [];
  constructor(
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.defaultSetting();
    this.generateUserDetailsForm();
    this.patchUserDetailsForm();
  }

  defaultSetting() {
    localStorage.setItem('selfPickUp', '0');
    let list = [];
    if (this.isStandardCut) {
      list = JSON.parse(localStorage.getItem('cart'))
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
    } else {
      list = JSON.parse(localStorage.getItem('directOrderProduct'))
        ? JSON.parse(localStorage.getItem('directOrderProduct'))
        : [];
    }

    this.finalOrderProducts = list.filter((x) => x.count !== 0);
    this.finalOrderProducts.forEach((x) => {
      this.orderSubTotal = this.orderSubTotal + x.price * x.count;
    });
    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
    if (this.isStandardCut) {
      this.setGlobalCartCount(list);
    } else {
      let standardList = JSON.parse(localStorage.getItem('cart'))
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
      this.setGlobalCartCount(standardList);
    }
  }

  setGlobalCartCount(addedProducts) {
    let count = 0;
    addedProducts.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }

  onChangeType(flag) {
    this.isSelfPickUp = flag;
    this.isSelfPickUp
      ? localStorage.setItem('selfPickUp', '1')
      : localStorage.setItem('selfPickUp', '0');
  }

  async onRedirectToPayment() {
    let str = [];
    await Object.keys(this.userDetailsForm.controls).forEach((key) => {
      console.log();
      if (this.userDetailsForm.controls[key].value) {
        console.log(this.userDetailsForm.controls[key].value);
        str.push(this.userDetailsForm.controls[key].value);
      }
    });
    localStorage.setItem('orderAddress', JSON.stringify(str));
    this.router.navigateByUrl(
      `shop/payment?isStandardCut=${this.isStandardCut ? 'true' : 'false'}`
    );
  }

  generateUserDetailsForm() {
    this.userDetailsForm = this.formBuilder.group({
      country: [''],
      zip: [''],
      state: [''],
      city: [''],
      address: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      company: [''],
      address2: [''],
      defaultFlag: [false],
      billFlag: [false],
    });
  }

  async patchUserDetailsForm() {
    await this.commonService.getUserDetails().then((res) => {
      this.userDetails = res;
      console.log('___', this.userDetails);
    });
    this.userDetailsForm.patchValue({
      firstName: this.userDetails.userDetails.fullName.split(' ')[0],
      lastName: this.userDetails.userDetails.fullName.split(' ')[1],
      email: this.userDetails.userDetails.email,
      phone: this.userDetails.userDetails.phoneNumber,
      address: this.userDetails.userDetails.addressList[0].addressLine,
      city: this.userDetails.userDetails.addressList[0].city,
      country: this.userDetails.userDetails.addressList[0].country,
      zip: this.userDetails.userDetails.addressList[0].postalCode,
      state: this.userDetails.userDetails.addressList[0].state,
    });
  }

  getCurrentDay() {
    var today = new Date(this.selectedDate).getDay();
    this.dayList.forEach((x) => {
      if (x.key == today) this.selectedDay = x.day;
    });
    this.getAllSlot();
  }
  getAllSlot() {
    this.apiService.request('GET_SLOTS', { params: {} }).subscribe((x) => {
      if (x) {
        console.log('res', x);
        this.allSlots = x.allSlotDetails.filter(
          (x) => x.day == this.selectedDay
        );
        if (!this.allSlots.length) {
          this.toastrService.error('No slots available');
        }
      }
    });
  }
}

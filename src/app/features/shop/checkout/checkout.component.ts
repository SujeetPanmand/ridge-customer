import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user/user-details';
import { CommonService } from 'src/app/shared/services/common.service';
import { checkoutLinks, dayList } from '../shop.config';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
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
  selectedDay: number;
  dayList = dayList;
  allSlots = [];
  singleSlotId = '';
  singleSlot = '';
  links: BreadCrumbLinks[] = checkoutLinks;
  productPicUrl = '';
  isPreorder = false;
  returnFromEditDate = '';
  constructor(
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    this.isPreorder =
      this.route.snapshot.queryParams['isPreorder'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let preSubstr = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/checkout?${substr}&${preSubstr}`;
  }

  ngOnInit() {
    this.commonService.gotoTop();
    this.getCartItems();
    this.defaultSetting();
    this.generateUserDetailsForm();
    this.patchUserDetailsForm();
    if (this.router.url.includes('isEdit')) {
      this.returnFromPaymentSetData();
    }
  }

  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let preSubstr = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/checkout?${substr}&${preSubstr}`;
  }

  showPageExitAlert() {
    this.modalService.open('', { size: 'lg', centered: true });
  }

  getCartItems() {
    this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          if (this.isStandardCut) {
            this.finalOrderProducts = res.allCartItemDetails;
            this.finalOrderProducts.forEach((x) => {
              this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
            });
            this.orderTotal =
              this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
          } else {
            let standardList = JSON.parse(
              localStorage.getItem('directOrderProduct')
            )
              ? JSON.parse(localStorage.getItem('directOrderProduct'))
              : [];
            standardList.forEach((item) => {
              item.quantity = item.count;
              item.productId = item.id;
              item.productName = item.name;
            });
            this.finalOrderProducts = standardList;
            this.finalOrderProducts.forEach((x) => {
              this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
            });
            this.orderTotal =
              this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
          }
          // this.addedProducts = this.cartItems;
          // this.commonService.cartProductValue.emit(this.cartItems.length ?? 0);
          // this.calculateOrderTotal();
        }
      },
      (error) => {}
    );
  }

  defaultSetting() {
    // localStorage.setItem('orderDate', '');
    // localStorage.setItem('orderSlot', '');
    //localStorage.setItem('selfPickUp', '0');
    // let list = [];
    // if (this.isStandardCut) {
    //   list = JSON.parse(localStorage.getItem('cart'))
    //     ? JSON.parse(localStorage.getItem('cart'))
    //     : [];
    // } else {
    //   list = JSON.parse(localStorage.getItem('directOrderProduct'))
    //     ? JSON.parse(localStorage.getItem('directOrderProduct'))
    //     : [];
    // }
    // this.finalOrderProducts = list.filter((x) => x.count !== 0);
    // if (this.isStandardCut) {
    //   this.setGlobalCartCount(list);
    // } else {
    //   let standardList = JSON.parse(localStorage.getItem('cart'))
    //     ? JSON.parse(localStorage.getItem('cart'))
    //     : [];
    //   this.setGlobalCartCount(standardList);
    // }
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
    localStorage.setItem('orderSlot', JSON.stringify(this.singleSlot));
    localStorage.setItem('slotId', JSON.stringify(this.singleSlotId));
    if (!this.singleSlotId) {
      this.toastrService.error('Please choose date and time slot.');
      return;
    }
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
      `shop/payment?isStandardCut=${
        this.isStandardCut ? 'true' : 'false'
      }&isPreorder=${this.isPreorder ? 'true' : 'false'}`
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
      firstName: this.userDetails.userDetails.firstName,
      lastName: this.userDetails.userDetails.lastName,
      email: this.userDetails.userDetails.email,
      phone: this.userDetails.userDetails.phoneNumber,
      address: this.userDetails.userDetails.addressList[0]['address1'],
      address2: this.userDetails.userDetails.addressList[0]['address2'],
      city: this.userDetails.userDetails.addressList[0].city,
      country: this.userDetails.userDetails.addressList[0].country,
      zip: this.userDetails.userDetails.addressList[0].postalCode,
      state: this.userDetails.userDetails.addressList[0].state,
    });
  }

  getCurrentDay() {
    this.singleSlotId = '';
    let date = this.router.url.includes('isEdit')
      ? this.returnFromEditDate
      : this.selectedDate;
    var today = new Date(date).getDay() + 1;
    this.dayList.forEach((x) => {
      if (x.key == today) this.selectedDay = x.key;
    });
  }

  getAllSlot() {
    this.apiService
      .request(this.isSelfPickUp ? 'GET_PICKUP_SLOTS' : 'GET_DELIVERY_SLOTS', {
        params: {},
      })
      .subscribe((x) => {
        if (x) {
          console.log('res', x);
          this.allSlots = this.isSelfPickUp
            ? x.allPickupSlotDetails.filter((x) => x.day == this.selectedDay)
            : x.allSlotDetails.filter((x) => x.day == this.selectedDay);
          this.allSlots.length
            ? localStorage.setItem(
                'orderDate',
                JSON.stringify(this.selectedDate)
              )
            : this.toastrService.error(
                'There are no available slots for selected day.'
              );
          if (this.router.url.includes('isEdit')) {
            this.singleSlotId = JSON.parse(localStorage.getItem('slotId'));
          }
        }
      });
  }

  onChangeSlot() {
    let element = [];
    element = this.allSlots.filter((x) => x.id == this.singleSlotId);
    this.singleSlot =
      element[0].startTimeHour +
      ': ' +
      element[0].startTimeMinut +
      element[0].startTimeUnit +
      +' ' +
      'TO' +
      ' ' +
      element[0].endTimeHour +
      ': ' +
      element[0].endTimeMinut +
      element[0].endTimeUnit;
  }

  setProductPic(id) {
    let date = new Date().getTime();
    this.productPicUrl = '';
    let url = environment.baseUrl + '/api/product/image/' + id;
    this.productPicUrl = url
      ? url + '?' + date
      : 'assets/product/wholeBeef.png';
    return this.productPicUrl;
  }

  async returnFromPaymentSetData() {
    let item = localStorage.getItem('selfPickUp');
    this.isSelfPickUp = item == '0' ? false : true;
    this.selectedDate = await this.datePipe.transform(
      new Date(JSON.parse(localStorage.getItem('orderDate'))),
      'yyyy-MM-dd'
    );
    this.returnFromEditDate = JSON.parse(localStorage.getItem('orderDate'));
    this.getCurrentDay();
  }
}

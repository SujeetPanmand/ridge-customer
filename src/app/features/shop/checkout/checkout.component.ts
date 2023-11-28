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
  allFilteredSlots = [];
  singleSlotId = '';
  singleSlot = '';
  links: BreadCrumbLinks[] = checkoutLinks;
  productPicUrl = '';
  isPreorder = false;
  returnFromEditDate = '';
  allAvailableSlot = [];
  isSundaySlot: boolean = false;
  isMondaySlot: boolean = false;
  isTuesdaySlot: boolean = false;
  isWednesdaySlot: boolean = false;
  isThursdaySlot: boolean = false;
  isFridaySlot: boolean = false;
  isSaturdaySlot: boolean = false;
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
    this.getAvailableSlot();
    this.commonService.gotoTop();
    this.isStandardCut && !this.isPreorder
      ? this.getCartItems()
      : this.showPreorderProductOrCustomProducts();
    this.defaultSetting();
    this.generateUserDetailsForm();
    this.patchUserDetailsForm();
    if (this.router.url.includes('isEdit')) {
      this.returnFromPaymentSetData();
    }
  }

  isAccordionOpen: boolean[] = [];
  toggleAccordion(index: number) {
    // Toggle the clicked accordion
    this.isAccordionOpen[index] = !this.isAccordionOpen[index];

    // Close all other accordions
    for (let i = 0; i < this.isAccordionOpen.length; i++) {
      if (i !== index) {
        this.isAccordionOpen[i] = false;
      }
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

  getAvailableSlot() {
    this.resetDay();
    this.apiService
      .request(this.isSelfPickUp ? 'GET_PICKUP_SLOTS' : 'GET_DELIVERY_SLOTS', {
        params: {},
      })
      .subscribe((res) => {
        if (res) {
          this.allAvailableSlot = this.isSelfPickUp
            ? res.allPickupSlotDetails
              ? res.allPickupSlotDetails
              : []
            : res.allSlotDetails
            ? res.allSlotDetails
            : [];
          this.heighLightSlotDay();
        }
      });
  }

  heighLightSlotDay() {
    this.allAvailableSlot.forEach((element) => {
      switch (element.day.toString()) {
        case '1':
          {
            this.isSundaySlot = true;
          }
          break;
        case '2':
          {
            this.isMondaySlot = true;
          }
          break;
        case '3':
          {
            this.isTuesdaySlot = true;
          }
          break;
        case '4':
          {
            this.isWednesdaySlot = true;
          }
          break;
        case '5':
          {
            this.isThursdaySlot = true;
          }
          break;
        case '6':
          {
            this.isFridaySlot = true;
          }
          break;
        case '7':
          {
            this.isSaturdaySlot = true;
          }
          break;
      }
    });
  }

  resetDay() {
    this.selectedDate = '';
    this.isSundaySlot = false;
    this.isMondaySlot = false;
    this.isTuesdaySlot = false;
    this.isWednesdaySlot = false;
    this.isThursdaySlot = false;
    this.isFridaySlot = false;
    this.isSaturdaySlot = false;
    this.isSundaySlot = false;
  }

  getCartItems() {
    this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          this.finalOrderProducts = res.allCartItemDetails;
          this.finalOrderProducts.forEach((x) => {
            this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
          });
          this.orderTotal =
            this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
        }
      },
      (error) => {}
    );
  }

  showPreorderProductOrCustomProducts() {
    let standardList = JSON.parse(localStorage.getItem('directOrderProduct'))
      ? JSON.parse(localStorage.getItem('directOrderProduct'))
      : [];
    standardList.forEach((item) => {
      item.quantity = item.count;
      item.productId = item.id;
      item.productName = item.name;
    });
    this.finalOrderProducts = standardList;

    this.orderSubTotal = this.isPreorder
      ? this.isStandardCut
        ? (this.finalOrderProducts[0].price *
            this.finalOrderProducts[0].preorderAmountPercentage) /
          100
        : (this.finalOrderProducts[0].price *
            this.finalOrderProducts[0].customCutPercentage) /
          100
      : (this.finalOrderProducts[0].price *
          this.finalOrderProducts[0].customCutPercentage) /
        100;

    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
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
    this.getAvailableSlot();
  }

  async onRedirectToPayment() {
    localStorage.setItem('orderSlot', JSON.stringify(this.singleSlot));
    localStorage.setItem('slotId', JSON.stringify(this.singleSlotId));
    this.isSelfPickUp
      ? localStorage.setItem('selfPickUp', '1')
      : localStorage.setItem('selfPickUp', '0');
    if (!this.singleSlotId) {
      this.toastrService.error('Please choose date and time slot.');
      return;
    }
    console.log(this.userDetailsForm.value);
    localStorage.setItem(
      'orderAddress',
      JSON.stringify(this.userDetailsForm.value)
    );
    this.router.navigateByUrl(
      `shop/payment?isStandardCut=${
        this.isStandardCut ? 'true' : 'false'
      }&isPreorder=${this.isPreorder ? 'true' : 'false'}`
    );
  }

  generateUserDetailsForm() {
    this.userDetailsForm = this.formBuilder.group({
      country: [''],
      zipCode: [''],
      state: [''],
      city: [''],
      address1: [''],
      firstName: [''],
      lastName: [''],
      emailAddress: [''],
      phoneNumber: [''],
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
      emailAddress: this.userDetails.userDetails.email,
      phoneNumber: this.userDetails.userDetails.phoneNumber,
      address1: this.userDetails.userDetails.addressList[0]['address1'],
      address2: this.userDetails.userDetails.addressList[0]['address2'],
      city: this.userDetails.userDetails.addressList[0].city,
      country: this.userDetails.userDetails.addressList[0].country,
      zipCode: this.userDetails.userDetails.addressList[0].postalCode,
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
    if (this.router.url.includes('isEdit')) {
      this.singleSlotId = JSON.parse(localStorage.getItem('slotId'));
    }

    this.allFilteredSlots = this.allAvailableSlot.filter(
      (x) => x.day == this.selectedDay
    );
    this.allFilteredSlots.length
      ? localStorage.setItem('orderDate', JSON.stringify(this.selectedDate))
      : this.toastrService.error(
          'There are no available slots for selected day.'
        );
  }

  onChangeSlot() {
    let element = [];
    element = this.allFilteredSlots.filter((x) => x.id == this.singleSlotId);
    this.singleSlot =
      element[0].startTimeHour +
      ':' +
      element[0].startTimeMinut +
      ' ' +
      element[0].startTimeUnit +
      ' ' +
      'TO' +
      ' ' +
      element[0].endTimeHour +
      ':' +
      element[0].endTimeMinut +
      ' ' +
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

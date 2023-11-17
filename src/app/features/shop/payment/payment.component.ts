import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { paymentLinks } from '../shop.config';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  TAX_AMOUNT = 70;
  SHIPPING_AMOUNT = 40;
  finalOrderProducts = [];
  orderTotal = 0;
  orderSubTotal = 0;
  isStandardCut = false;
  isSelfPickUp = false;
  orderAddress = [];
  orderDate = '';
  orderSlot = '';
  links: BreadCrumbLinks[] = paymentLinks;
  productPicUrl = '';
  isPreorder = false;
  paymentForm: FormGroup;
  slotId = '';
  formSubmitAttempt = false;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    this.isPreorder =
      this.route.snapshot.queryParams['isPreorder'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let preSubstr = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/payment?${substr}&${preSubstr}`;
  }
  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let preSubstr = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/payment?${substr}&${preSubstr}`;
  }

  ngOnInit() {
    this.defaultSetting();
    this.generatePaymentForm();
  }
  generatePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      cardHolderName: ['', Validators.required],
    });
  }

  defaultSetting() {
    this.isSelfPickUp =
      localStorage.getItem('selfPickUp') == '0' || null ? false : true;
    this.orderDate = JSON.parse(localStorage.getItem('orderDate'))
      ? JSON.parse(localStorage.getItem('orderDate'))
      : '';
    this.orderSlot = JSON.parse(localStorage.getItem('orderSlot'))
      ? JSON.parse(localStorage.getItem('orderSlot'))
      : '';
    this.orderAddress = JSON.parse(localStorage.getItem('orderAddress'))
      ? JSON.parse(localStorage.getItem('orderAddress'))
      : [];

    this.slotId = JSON.parse(localStorage.getItem('slotId'))
      ? JSON.parse(localStorage.getItem('slotId'))
      : [];
    this.getCartItems();
  }

  getCartItems() {
    this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          this.setGlobalCartCount(res.allCartItemDetails.length);
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
        }
      },
      (error) => {}
    );
  }

  setGlobalCartCount(count) {
    this.commonService.addProducts(count);
  }
  createOrder() {
    this.formSubmitAttempt = true;
    if (this.paymentForm.invalid) {
      return;
    }
    const apiRequest = {
      data: this.isSelfPickUp
        ? {
            cardNumber: Number(this.paymentForm.controls['cardNumber'].value),
            expiryDate: new Date(
              this.paymentForm.controls['expiryDate'].value
            ).toISOString(),
            cvv: Number(this.paymentForm.controls['cvv'].value),
            cardHolderName: this.paymentForm.controls['cardHolderName'].value,
            isSelfPickup: this.isSelfPickUp,
            country: this.orderAddress[0],
            zipCode: this.orderAddress[1],
            state: this.orderAddress[2],
            city: this.orderAddress[3],
            address1: this.orderAddress[4],
            address2: '',
            firstName: this.orderAddress[5],
            lastName: this.orderAddress[6],
            emailAddress: this.orderAddress[7],
            phoneNumber: this.orderAddress[8],
            company: this.orderAddress[9],
            subTotalAmount: this.orderSubTotal,
            tax: this.TAX_AMOUNT + this.SHIPPING_AMOUNT,
            totalAmount: this.orderTotal,
            orderType: this.isPreorder ? 1 : 2,
            cutType: this.isStandardCut ? 1 : 2,

            pickupSlotId: this.slotId,
            expectedDeliveryDate: new Date(this.orderDate).toISOString(),
            sameAsBillingAddress: true,
            isSaveAddress: true,
            orderItemsModel: this.formatRecord(this.finalOrderProducts),
          }
        : {
            cardNumber: Number(this.paymentForm.controls['cardNumber'].value),
            expiryDate: new Date(
              this.paymentForm.controls['expiryDate'].value
            ).toISOString(),
            cvv: Number(this.paymentForm.controls['cvv'].value),
            cardHolderName: this.paymentForm.controls['cardHolderName'].value,
            isSelfPickup: this.isSelfPickUp,
            country: this.orderAddress[0],
            zipCode: this.orderAddress[1],
            state: this.orderAddress[2],
            city: this.orderAddress[3],
            address1: this.orderAddress[4],
            address2: '',
            firstName: this.orderAddress[5],
            lastName: this.orderAddress[6],
            emailAddress: this.orderAddress[7],
            phoneNumber: this.orderAddress[8],
            company: this.orderAddress[9],
            subTotalAmount: this.orderSubTotal,
            tax: this.TAX_AMOUNT + this.SHIPPING_AMOUNT,
            totalAmount: this.orderTotal,
            orderType: this.isPreorder ? 2 : 1,
            cutType: this.isStandardCut ? 1 : 2,
            slotId: this.slotId,

            expectedDeliveryDate: new Date(this.orderDate).toISOString(),
            sameAsBillingAddress: true,
            isSaveAddress: true,
            orderItemsModel: this.formatRecord(this.finalOrderProducts),
          },
    };
    this.apiService.request('CREATE_ORDER', apiRequest).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.removLocalItems();
        this.router.navigateByUrl(
          `shop/order-confirmation?isStandardCut=${
            this.isStandardCut ? 'true' : 'false'
          }&isPreorder=${this.isPreorder ? 'true' : 'false'}`
        );
        this.toastrService.success('Thank you; your order is placed.');
      }
    });
  }
  goBack() {
    this.router.navigateByUrl(
      `shop/checkout?isStandardCut=${
        this.isStandardCut ? 'true' : 'false'
      }&isPreorder=${this.isPreorder ? 'true' : 'false'}`
    );
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
  formatRecord(data) {
    return data.map((x) => {
      return {
        productId: x.productId,
        quantity: x.quantity,
      };
    });
  }

  removLocalItems() {
    localStorage.removeItem('orderAddress');
    localStorage.removeItem('directOrderProduct');
    localStorage.removeItem('orderSlot');
    localStorage.removeItem('slotId');
    localStorage.removeItem('cart');
    localStorage.removeItem('orderDate');
    localStorage.removeItem('selfPickUp');
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

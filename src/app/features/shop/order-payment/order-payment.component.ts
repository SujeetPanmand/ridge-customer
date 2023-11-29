import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { cartTypes, partialPaymentLinks } from '../shop.config';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss'],
})
export class OrderPaymentComponent implements OnInit, AfterViewInit {
  isSelfPickUp = false;
  orderAddress = [];
  paymentForm: FormGroup;
  formSubmitAttempt = false;
  links: BreadCrumbLinks[] = partialPaymentLinks;
  orderId: '';
  orderPaymentDetails: any;
  isLoading = false;
  totalAmount: any;
  cardImage = '';
  checkCardType = new Subject<string>();
  cartTypes = cartTypes;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.subscribeToCreditType();
    this.orderId = this.route.snapshot.params['orderId'];
    this.links[1].link = `/account/order-details/${this.orderId}`;
    this.links[2].link = `/shop/order-payment/${this.orderId}`;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.defaultSetting();
    this.generatePaymentForm();
    this.getOrderPaymentDetailsById();
  }

  generatePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(19),
          Validators.minLength(15),
        ],
      ],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      cardHolderName: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {}

  goBack() {}

  defaultSetting() {
    this.isSelfPickUp =
      JSON.parse(localStorage.getItem('selfPickUp')) == '0' ? false : true;

    this.orderAddress = JSON.parse(localStorage.getItem('orderAddress'))
      ? JSON.parse(localStorage.getItem('orderAddress'))
      : [];
  }

  getOrderPaymentDetailsById() {
    this.apiService
      .request('GET_ORDER_PAYMENT_DETAILS', {
        params: { id: this.route.snapshot.params['orderId'] },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.orderPaymentDetails = res.orderPaymentDetails;
        }
      });
  }

  createOrder() {
    this.formSubmitAttempt = true;
    if (this.paymentForm.invalid) {
      return;
    }
    this.isLoading = true;
    const apiRequest = {
      data: this.isSelfPickUp
        ? {
            cardNumber: Number(this.paymentForm.controls['cardNumber'].value),
            expiryDate: new Date(
              this.paymentForm.controls['expiryDate'].value
            ).toISOString(),
            cvv: Number(this.paymentForm.controls['cvv'].value),
            cardHolderName: this.paymentForm.controls['cardHolderName'].value,
            totalAmount: '1000',
            orderId: this.orderId,
          }
        : {
            cardNumber: Number(this.paymentForm.controls['cardNumber'].value),
            expiryDate: new Date(
              this.paymentForm.controls['expiryDate'].value
            ).toISOString(),
            cvv: Number(this.paymentForm.controls['cvv'].value),
            cardHolderName: this.paymentForm.controls['cardHolderName'].value,
            totalAmount: '1000',
            orderId: this.orderId,
          },
    };

    this.apiService
      .request('COMPLETE_ORDER_PAYMENT', apiRequest)
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.isLoading = false;

          this.toastrService.success('Your order has been successfull.');
        }
      });
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

  subscribeToCreditType() {
    this.checkCardType.pipe(debounceTime(1000)).subscribe((value) => {
      if (value) {
        this.cartTypes.forEach((x) => {
          if (x.expressions[0].pattern.test(value)) {
            this.cardImage = x.image;
          }
        });
      }
    });
  }
}

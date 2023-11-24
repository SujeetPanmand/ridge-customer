import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { paymentLinks } from '../shop.config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit, AfterViewInit {
  isSelfPickUp = false;
  orderAddress = [];
  paymentForm: FormGroup;
  formSubmitAttempt = false;
  links: BreadCrumbLinks[] = paymentLinks;
  orderId:'';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ){
    this.orderId = this.route.snapshot.params['orderId'];
    this.links[2].link = `/shop/payment`;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.defaultSetting();
    this.generatePaymentForm();
  }

  generatePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required],
      cardHolderName: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.links[2].link = `/shop/payment`;
  }

  goBack() {
  }

  defaultSetting() {
    this.isSelfPickUp =
      JSON.parse(localStorage.getItem('selfPickUp')) == '0' ? false : true;

    this.orderAddress = JSON.parse(localStorage.getItem('orderAddress'))
      ? JSON.parse(localStorage.getItem('orderAddress'))
      : [];

  }

  
  onCardNumberInput(event: any): void {
    // Remove non-numeric characters from the input value
    const numericValue = event.target.value.replace(/\D/g, '');

    // Limit the input to 16 characters
    this.paymentForm.get('cardNumber').setValue(numericValue.slice(0, 16));
  }

  get cardIconClass(): string {
    const numericCardNumber = this.paymentForm
      .get('cardNumber')
      .value.replace(/\D/g, '');

    if (numericCardNumber.startsWith('4')) {
      return 'fab fa-cc-visa';
    } else if (numericCardNumber.startsWith('5')) {
      return 'fab fa-cc-mastercard';
    } else {
      return 'fas fa-credit-card';
    }
  }

  createOrder(){
    this.formSubmitAttempt = true;
    console.log("ON CLICK CALLED");
    if (this.paymentForm.invalid) {
      return;
    }
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

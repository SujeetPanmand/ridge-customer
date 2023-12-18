import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { cartTypes, partialPaymentLinks } from '../shop.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/component/confirmation-pop-up/confirmation-pop-up.component';
import { OrderDetails } from 'src/app/shared/interfaces/order-confirmation';
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss'],
})
export class OrderPaymentComponent implements OnInit, AfterViewInit {
  //isSelfPickUp = false;
  //orderAddress = [];
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
  years = [];
  isLoggedIn = 0;
  stripe: any;
  elements: any;
  card: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    public commonService: CommonService
  ) {
    this.getYearList();
    this.subscribeToCreditType();
    this.orderId = this.route.snapshot.params['orderId'];
    this.links[1].link = `/account/order-details/${this.orderId}`;
    this.links[2].link = `/shop/order-payment/${this.orderId}`;
    this.loadStripe();
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.commonService.getUserDetails().then((x) => {
      if (x) this.isLoggedIn = 1;
    });
    //this.defaultSetting();
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
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      cvv: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      cardHolderName: ['', Validators.required],
    });
  }
  formatCardNumber(event: any): void {
    const inputElement = event.target;
    let inputValue = inputElement.value.replace(/[-\s]/g, ''); // Remove existing spaces and dashes
    let formattedValue = inputValue.replace(/(\d{4})/g, '$1-'); // Add dashes every 4 digits

    // Remove the last dash if it exists
    const lastDashIndex = formattedValue.lastIndexOf('-');
    if (lastDashIndex === formattedValue.length - 1) {
      formattedValue = formattedValue.substring(0, lastDashIndex);
    }

    // Update the input value
    this.paymentForm.get('cardNumber').setValue(formattedValue);
  }
  ngAfterViewInit(): void {}

  async loadStripe() {
    this.stripe = await loadStripe(environment.STRIPE_PUBLISH_KEY);
    //const loader = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

    this.elements = this.stripe.elements();
    const style = {
      base: {
        hidePostalCode: true,
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    // Create an instance of the card Element.
    this.card = this.elements.create('card', { style: style });
    // Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');
    this.card.addEventListener('change', (event) => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  createToken() {
    this.stripe.createToken(this.card).then((result) => {
      console.log('__________' + result);
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server
        this.stripeTokenHandler(result.token);
      }
    });
  }

  stripeTokenHandler(token) {
    console.log('_____token', token);
    this.createOrder(token);
  }

  createOrder(token) {
    const apiRequest = {
      data: {
        stId: token.id,
        totalAmount: this.orderPaymentDetails.payment,
        orderId: this.orderId.trim(),
      },
    };

    this.apiService.request('COMPLETE_ORDER_PAYMENT', apiRequest).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          this.router.navigateByUrl(
            `account/order-details/${this.route.snapshot.params[
              'orderId'
            ].trim()}`
          );
          this.toastrService.success(res.message);
        } else {
          this.toastrService.error(res.message);
        }
      },
      (error) => {}
    );
  }

  goBack() {}

  // defaultSetting() {
  //   this.isSelfPickUp =
  //     JSON.parse(localStorage.getItem('selfPickUp')) == '0' ? false : true;

  //   this.orderAddress = JSON.parse(localStorage.getItem('orderAddress'))
  //     ? JSON.parse(localStorage.getItem('orderAddress'))
  //     : [];
  // }

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

  confirmOrder() {
    let data = {
      action_button_name: 'Yes',
      title_text: 'Confirmation',
      text: `Do you really want to make a payment?`,
    };
    let modelRef = this.modalService.open(ConfirmationPopUpComponent, {
      size: 'md',
      centered: true,
    });
    modelRef.componentInstance.data = data;

    modelRef.result.then((res) => {
      if (res) {
        this.createToken();
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
      value = value.replace(/-/g, '');
      if (value) {
        this.cartTypes.forEach((x) => {
          if (x.expressions[0].pattern.test(value)) {
            this.cardImage = x.image;
          }
        });
      }
    });
  }

  getYearList() {
    const d = new Date();
    let year = d.getFullYear();
    for (let i = year; i <= year + 50; i++) {
      this.years.push({ id: i, year: i });
    }
  }

  get onSelectMonth() {
    var selectedYear = this.paymentForm.controls['expiryYear'].value;
    var selectedMonth = this.paymentForm.controls['expiryMonth'].value;
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    currentMonth = currentMonth + 1;
    if (selectedMonth != '') {
      if (selectedYear == currentYear) {
        if (selectedMonth < currentMonth) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

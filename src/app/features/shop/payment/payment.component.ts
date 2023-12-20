import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { cartTypes, paymentLinks } from '../shop.config';
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopUpComponent } from 'src/app/shared/component/confirmation-pop-up/confirmation-pop-up.component';

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
  isLoading = false;
  checkCardType = new Subject<string>();
  cardImage = '';
  cartTypes = cartTypes;
  years = [];
  isLoggedIn = 0;
  balanceDue = 0;
  totalBalanceDue = 0;
  grandTotal = 0;
  isNotValidMonth = false;
  stripe: any;
  elements: any;
  card: any;
  isConfirmationLoading = false;
  @ViewChild('paymentForm') submitPaymentForm: NgForm;
  constructor(
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {
    this.subscribeToCartItems();
    this.getYearList();
    this.subscribeToCreditType();
    this.getRouterParams();
    this.loadStripe();
  }

  async loadStripe() {
    this.stripe = await loadStripe(environment.STRIPE_PUBLISH_KEY);
    //const loader = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

    this.elements = this.stripe.elements();
    const style = {
      base: {
        hidePostalCode: true,
        color: '#32325d',
        fontSmoothing: 'antialiased',
        fontSize: '18px',
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
    this.card = this.elements.create('card', {
      hidePostalCode: true,
      style: style,
    });
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
        if (this.isConfirmationLoading) {
          return;
        }
        this.isConfirmationLoading = true;
        let data = {
          action_button_name: 'Yes',
          title_text: 'Confirmation',
          text: `Are you sure want to make a payment?`,
        };
        let modelRef = this.modalService.open(ConfirmationPopUpComponent, {
          size: 'md',
          centered: true,
          backdrop: false,
        });
        modelRef.componentInstance.data = data;

        modelRef.result.then((res) => {
          if (res) {
            this.stripeTokenHandler(result.token);
          } else {
            this.isConfirmationLoading = false;
          }
        });
        // Send the token to your server
      }
    });
  }

  stripeTokenHandler(token) {
    this.createOrder(token);
  }

  createOrder(token) {
    const apiRequest = {
      data: this.isSelfPickUp
        ? {
            // cardNumber: Number(
            //   this.paymentForm.controls['cardNumber'].value.replace(/-/g, '')
            // ),
            // expiryMonth:
            //   this.paymentForm.controls['expiryMonth'].value.toString(),
            // expiryYear:
            //   this.paymentForm.controls['expiryYear'].value.toString(),
            // cvv: Number(this.paymentForm.controls['cvv'].value),
            // cardHolderName: this.paymentForm.controls['cardHolderName'].value,
            isSelfPickup: this.isSelfPickUp,

            country: this.orderAddress['country'],
            zipCode: this.orderAddress['zipCode']
              ? this.orderAddress['zipCode'].toString()
              : '',
            state: this.orderAddress['state'],
            city: this.orderAddress['city'],
            address1: this.orderAddress['address1'],

            firstName: this.orderAddress['firstName'],
            lastName: this.orderAddress['lastName'],

            emailAddress: this.orderAddress['emailAddress'],
            phoneNumber: this.orderAddress['phoneNumber'].toString(),
            company: this.orderAddress['company'],
            address2: this.orderAddress['address2'],
            subTotalAmount: this.orderSubTotal,
            tax: this.TAX_AMOUNT,
            totalAmount: this.orderTotal,
            orderType: this.isPreorder ? 2 : 1,
            cutType: this.isStandardCut ? 1 : 2,

            pickupSlotId: this.slotId,
            expectedDeliveryDate: new Date(this.orderDate).toISOString(),
            sameAsBillingAddress: true,
            isSaveAddress: true,
            shippingCharges: 0,
            orderItemsModel: this.formatRecord(this.finalOrderProducts),
            stId: token.id,
          }
        : {
            // cardNumber: Number(
            //   this.paymentForm.controls['cardNumber'].value.replace(/-/g, '')
            // ),
            // expiryMonth:
            //   this.paymentForm.controls['expiryMonth'].value.toString(),
            // expiryYear:
            //   this.paymentForm.controls['expiryYear'].value.toString(),
            // cvv: Number(this.paymentForm.controls['cvv'].value),
            // cardHolderName: this.paymentForm.controls['cardHolderName'].value,
            isSelfPickup: this.isSelfPickUp,
            country: this.orderAddress['country'],
            zipCode: this.orderAddress['zipCode'].toString(),
            state: this.orderAddress['state'],
            city: this.orderAddress['city'],
            address1: this.orderAddress['address1'],
            firstName: this.orderAddress['firstName'],
            lastName: this.orderAddress['lastName'],
            emailAddress: this.orderAddress['emailAddress'],
            phoneNumber: this.orderAddress['phoneNumber'].toString(),
            company: this.orderAddress['company'],
            address2: this.orderAddress['address2'],
            subTotalAmount: this.orderSubTotal,
            tax: this.TAX_AMOUNT,
            totalAmount: this.orderTotal,
            orderType: this.isPreorder ? 2 : 1,
            cutType: this.isStandardCut ? 1 : 2,
            slotId: this.slotId,

            expectedDeliveryDate: new Date(this.orderDate).toISOString(),
            sameAsBillingAddress: true,
            isSaveAddress: true,
            shippingCharges: this.SHIPPING_AMOUNT,
            orderItemsModel: this.formatRecord(this.finalOrderProducts),
            stId: token.id,
          },
    };

    this.apiService.request('CREATE_ORDER', apiRequest).subscribe(
      (res) => {
        this.isLoading = false;
        if (res && res.statusCode == 200) {
          this.removLocalItems();
          this.commonService.onOrderConfirm();
          this.router.navigateByUrl(
            `shop/order-confirmation/${res.message}?isStandardCut=${
              this.isStandardCut ? 'true' : 'false'
            }&isPreorder=${this.isPreorder ? 'true' : 'false'}`
          );
          this.toastrService.success('Your order has been placed.');
        } else {
          this.toastrService.error(res.message);
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  getRouterParams() {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    this.isPreorder =
      this.route.snapshot.queryParams['isPreorder'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let preSubstr = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/checkout?${substr}&${preSubstr}&isEdit=true`;
    this.links[3].link = `/shop/payment?${substr}&${preSubstr}`;
  }

  getYearList() {
    const d = new Date();
    let year = d.getFullYear();
    for (let i = year; i <= year + 50; i++) {
      this.years.push({ id: i, year: i });
    }
  }
  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let preSubstr = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/checkout?${substr}&${preSubstr}&isEdit=true`;
    this.links[3].link = `/shop/payment?${substr}&${preSubstr}`;
  }

  ngOnInit() {
    //this.getCartItemsToShow();
    this.commonService.setGlobalCartCount();
    this.defaultSetting();
    this.generatePaymentForm();
    if (this.isPreorder || !this.isStandardCut) {
      this.showPreorderProductOrCustomProducts();
    }
  }

  // getCartItemsToShow() {
  //   if (this.isStandardCut && !this.isPreorder) {
  //     if (this.commonService.cartItems.length) {
  //       this.finalOrderProducts = this.commonService.cartItems;
  //       this.finalOrderProducts.forEach((x) => {
  //         this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
  //       });

  //       this.orderTotal = !this.isSelfPickUp
  //         ? this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT
  //         : this.orderSubTotal + this.TAX_AMOUNT;
  //     } else {
  //       this.commonService.setGlobalCartCount();
  //     }
  //   }
  // }
  generatePaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(19),
        ],
      ],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      cvv: new FormControl('', [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3),
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      cardHolderName: ['', Validators.required],
    });
  }

  // get cardIconClass(): string {
  //   const numericCardNumber = this.paymentForm
  //     .get('cardNumber')
  //     .value.replace(/\D/g, '');

  //   if (numericCardNumber.startsWith('4')) {
  //     return 'fab fa-cc-visa';
  //   } else if (numericCardNumber.startsWith('5')) {
  //     return 'fab fa-cc-mastercard';
  //   } else {
  //     return 'fas fa-credit-card';
  //   }
  // }

  // onCardNumberInput(event: any): void {
  //   // Remove non-numeric characters from the input value
  //   const numericValue = event.target.value.replace(/\D/g, '');

  //   // Limit the input to 16 characters
  //   this.paymentForm.get('cardNumber').setValue(numericValue.slice(0, 16));
  // }

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

  defaultSetting() {
    this.isSelfPickUp =
      JSON.parse(localStorage.getItem('selfPickUp')) == '0' ? false : true;
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
  }

  subscribeToCartItems() {
    this.commonService.cartItemsEvent.subscribe((items) => {
      if (this.isStandardCut && !this.isPreorder) {
        this.finalOrderProducts = items;

        this.orderSubTotal = 0;
        this.orderTotal = 0;
        this.finalOrderProducts.forEach((x) => {
          this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
        });

        this.isSelfPickUp =
          JSON.parse(localStorage.getItem('selfPickUp')) == '0' ? false : true;
        this.orderTotal = !this.isSelfPickUp
          ? this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT
          : this.orderSubTotal + this.TAX_AMOUNT;
      }
    });
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
    this.balanceDue = this.finalOrderProducts[0].price - this.orderSubTotal;
    this.totalBalanceDue = !this.isSelfPickUp
      ? this.balanceDue + this.TAX_AMOUNT + this.SHIPPING_AMOUNT
      : this.balanceDue + this.TAX_AMOUNT;
    this.grandTotal = this.totalBalanceDue + this.orderSubTotal;
    this.orderTotal = !this.isSelfPickUp
      ? this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT
      : this.orderSubTotal + this.TAX_AMOUNT;
  }

  goBack() {
    this.router.navigateByUrl(
      `shop/checkout?isStandardCut=${
        this.isStandardCut ? 'true' : 'false'
      }&isEdit=true&${this.isPreorder ? 'isPreorder=true' : 'isPreorder=false'}`
    );
  }
  setProductPic(id) {
    return id
      ? environment.baseUrl + '/api/product/image/' + id
      : 'assets/product/wholeBeef.png';
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
    localStorage.removeItem('orderSlot');
    localStorage.removeItem('slotId');
    localStorage.removeItem('cart');
    localStorage.removeItem('orderDate');
    localStorage.removeItem('selfPickUp');
    localStorage.removeItem('ridgeOfflineCartItems');
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

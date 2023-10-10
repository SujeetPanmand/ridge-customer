import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent implements OnInit {
  TAX_AMOUNT = 70;
  SHIPPING_AMOUNT = 40;
  finalOrderProducts = [];
  orderTotal = 0;
  orderSubTotal = 0;
  constructor() {}

  ngOnInit() {
    this.defaultSetting();
  }

  defaultSetting() {
    this.finalOrderProducts = JSON.parse(
      localStorage.getItem('finalOrderProducts')
    )
      ? JSON.parse(localStorage.getItem('finalOrderProducts'))
      : [];
    this.finalOrderProducts.forEach((x) => {
      this.orderSubTotal = this.orderSubTotal + x.totalPrice;
    });
    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
  }
}

import { Component } from '@angular/core';

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
  onChangeType(flag) {
    this.isSelfPickUp = flag;
  }
}

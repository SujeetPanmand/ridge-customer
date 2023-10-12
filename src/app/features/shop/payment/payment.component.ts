import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  TAX_AMOUNT = 70;
  SHIPPING_AMOUNT = 40;
  finalOrderProducts = [];
  orderTotal = 0;
  orderSubTotal = 0;
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.defaultSetting();
  }
  defaultSetting() {
    let list = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.finalOrderProducts = list.filter((x) => x.count !== 0);
    this.finalOrderProducts.forEach((x) => {
      this.orderSubTotal = this.orderSubTotal + x.price * x.count;
    });
    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
    this.setGlobalCartCount(list);
  }

  setGlobalCartCount(addedProducts) {
    let count = 0;
    addedProducts.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

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
  isStandardCut = false;
  isSelfPickUp = false;
  orderAddress = [];

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
  }

  ngOnInit() {
    this.defaultSetting();
  }
  defaultSetting() {
    this.isSelfPickUp =
      localStorage.getItem('selfPickUp') == '0' || null ? false : true;
    this.orderAddress = JSON.parse(localStorage.getItem('orderAddress'))
      ? JSON.parse(localStorage.getItem('orderAddress'))
      : [];
    let list = [];
    if (this.isStandardCut) {
      list = JSON.parse(localStorage.getItem('cart'))
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
    } else {
      list = JSON.parse(localStorage.getItem('directOrderProduct'))
        ? JSON.parse(localStorage.getItem('directOrderProduct'))
        : [];
    }

    this.finalOrderProducts = list.filter((x) => x.count !== 0);
    this.finalOrderProducts.forEach((x) => {
      this.orderSubTotal = this.orderSubTotal + x.price * x.count;
    });
    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
    if (this.isStandardCut) {
      this.setGlobalCartCount(list);
    } else {
      let standardList = JSON.parse(localStorage.getItem('cart'))
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
      this.setGlobalCartCount(standardList);
    }
  }

  setGlobalCartCount(addedProducts) {
    let count = 0;
    addedProducts.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }
  onRedirectToOrderConfirm() {
    this.router.navigateByUrl(
      `shop/order-confirmation?isStandardCut=${
        this.isStandardCut ? 'true' : 'false'
      }`
    );
  }
  goBack() {
    this.router.navigateByUrl(
      `shop/checkout?isStandardCut=${this.isStandardCut ? 'true' : 'false'}`
    );
  }
}

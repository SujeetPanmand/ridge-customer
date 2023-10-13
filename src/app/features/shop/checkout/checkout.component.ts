import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

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
  isStandardCut = false;
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
    }
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
  }
  onRedirectToPayment() {
    this.router.navigateByUrl(
      `shop/payment?${this.isStandardCut ? 'true' : 'false'}`
    );
  }
}

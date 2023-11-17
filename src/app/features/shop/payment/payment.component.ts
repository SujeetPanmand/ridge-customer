import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { paymentLinks } from '../shop.config';
import { environment } from 'src/environments/environment';

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
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
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
  }
  defaultSetting() {
    this.isSelfPickUp =
      localStorage.getItem('selfPickUp') == '0' || null ? false : true;
    this.orderDate = localStorage.getItem('orderDate')
      ? localStorage.getItem('orderDate')
      : '';
    this.orderSlot = localStorage.getItem('orderSlot')
      ? localStorage.getItem('orderSlot')
      : '';
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
      }&isPreorder=${this.isPreorder ? 'true' : 'false'}`
    );
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
}

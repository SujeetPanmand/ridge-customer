import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { orderConfirmationLinks } from '../shop.config';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent implements OnInit, AfterViewInit {
  TAX_AMOUNT = 70;
  SHIPPING_AMOUNT = 40;
  finalOrderProducts = [];
  orderTotal = 0;
  orderSubTotal = 0;
  isStandardCut = false;
  links: BreadCrumbLinks[] = orderConfirmationLinks;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    this.links[2].link = `/shop/order-confirmation?${substr}`;
  }
  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    this.links[2].link = `/shop/order-confirmation?${substr}`;
  }

  ngOnInit() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.router.navigate(['/shop']);
        }
      }
    });
    this.defaultSetting();
  }

  printInvoice() {
    window.print();
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
}

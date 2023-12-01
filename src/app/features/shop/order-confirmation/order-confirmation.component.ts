import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { orderConfirmationLinks } from '../shop.config';
import { ApiService } from 'src/app/shared/services/api.service';
import { MyOrders } from 'src/app/shared/interfaces/my-orders';
import { DatePipe } from '@angular/common';
import { OrderDetails } from 'src/app/shared/interfaces/order-confirmation';

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
  orderDetails: OrderDetails;
  orderOn: any;
  isPreorder = false;
  // isGoogleLinkShow = true;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.getRouterParams();
  }

  getRouterParams() {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    this.isPreorder =
      this.route.snapshot.queryParams['isPreorder'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let substr1 = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/order-confirmation/${this.route.snapshot.params['orderId']}?${substr}&${substr1}`;
  }
  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    let substr1 = this.isPreorder ? 'isPreorder=true' : 'isPreorder=false';
    this.links[2].link = `/shop/order-confirmation/${this.route.snapshot.params['orderId']}?${substr}&${substr1}`;
  }

  ngOnInit() {
    this.getOrderInvoiceId();
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.router.navigate(['/shop']);
        }
      }
    });
    if (this.isPreorder || !this.isStandardCut) {
      this.showPreorderProductOrCustomProducts();
    }
    this.defaultSetting();
  }

  getOrderInvoiceId() {
    this.apiService
      .request('GET_INVOICE', {
        params: { id: this.route.snapshot.params['orderId'] },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          console.log(res);
          this.orderDetails = res.orderDetails;
          this.getCartItems(this.orderDetails);
          this.orderOn = this.datePipe.transform(
            new Date(this.orderDetails.createdAt),
            'MM/dd/yyyy'
          );
        }
      });
  }

  printInvoice() {
    window.print();
  }

  defaultSetting() {
    // let list = [];
    // if (this.isStandardCut) {
    //   list = JSON.parse(localStorage.getItem('cart'))
    //     ? JSON.parse(localStorage.getItem('cart'))
    //     : [];
    // } else {
    //   list = JSON.parse(localStorage.getItem('directOrderProduct'))
    //     ? JSON.parse(localStorage.getItem('directOrderProduct'))
    //     : [];
    // }
    // this.finalOrderProducts = list.filter((x) => x.quantity !== 0);
    // this.finalOrderProducts.forEach((x) => {
    //   this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
    // });
    // this.orderTotal =
    //   this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
    // if (this.isStandardCut) {
    //   this.setGlobalCartCount(this.finalOrderProducts);
    // } else {
    //   let standardList = JSON.parse(localStorage.getItem('cart'))
    //     ? JSON.parse(localStorage.getItem('cart'))
    //     : [];
    //   this.setGlobalCartCount(standardList);
    // }
  }
  getCartItems(res) {
    this.finalOrderProducts = res.orderItemDetails;
    this.finalOrderProducts.forEach((x) => {
      this.orderSubTotal = this.orderSubTotal + x.unitPrice * x.quantity;
      x['price'] = x.unitPrice;
    });
    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
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
    this.orderTotal =
      this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
  }
}

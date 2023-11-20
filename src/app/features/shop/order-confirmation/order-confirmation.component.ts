import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { CommonService } from 'src/app/shared/services/common.service';
import { orderConfirmationLinks } from '../shop.config';
import { ApiService } from 'src/app/shared/services/api.service';
import { MyOrders } from 'src/app/shared/interfaces/my-orders';
import { DatePipe } from '@angular/common';

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
  orderDetails: MyOrders;
  orderOn: any;
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    this.links[2].link = `/shop/order-confirmation/${this.route.snapshot.params['orderId']}?${substr}`;
  }
  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    this.links[2].link = `/shop/order-confirmation/${this.route.snapshot.params['orderId']}?${substr}`;
  }

  ngOnInit() {
    this.getCartItems();
    this.getOrderInvoiceId();
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.router.navigate(['/shop']);
        }
      }
    });
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
  getCartItems() {
    this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          this.setGlobalCartCount(res.allCartItemDetails.length);
          if (this.isStandardCut) {
            this.finalOrderProducts = res.allCartItemDetails;
            this.finalOrderProducts.forEach((x) => {
              this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
            });
            this.orderTotal =
              this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
          } else {
            let standardList = JSON.parse(
              localStorage.getItem('directOrderProduct')
            )
              ? JSON.parse(localStorage.getItem('directOrderProduct'))
              : [];
            standardList.forEach((item) => {
              item.quantity = item.count;
              item.productId = item.id;
              item.productName = item.name;
            });
            this.finalOrderProducts = standardList;
            this.finalOrderProducts.forEach((x) => {
              this.orderSubTotal = this.orderSubTotal + x.price * x.quantity;
            });
            this.orderTotal =
              this.orderSubTotal + this.TAX_AMOUNT + this.SHIPPING_AMOUNT;
          }
        }
      },
      (error) => {}
    );
  }
  setGlobalCartCount(count) {
    this.commonService.addProducts(count);
  }
}

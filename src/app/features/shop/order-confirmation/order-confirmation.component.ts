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
  remainingAmount = 0;
  // isGoogleLinkShow = true;
  constructor(
    public commonService: CommonService,
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
  }

  formatTime(timeSlot: any): string {
    if (!timeSlot) {
      return "--"; 
    }
    const startTimeHour = timeSlot.startTimeHour < 10 ? "0" + timeSlot.startTimeHour : timeSlot.startTimeHour;
    const startTimeMinut = timeSlot.startTimeMinut < 10 ? "0" + timeSlot.startTimeMinut : timeSlot.startTimeMinut;
    const endTimeHour = timeSlot.endTimeHour < 10 ? "0" + timeSlot.endTimeHour : timeSlot.endTimeHour;
    const endTimeMinut = timeSlot.endTimeMinut < 10 ? "0" + timeSlot.endTimeMinut : timeSlot.endTimeMinut;

    return `${startTimeHour}:${startTimeMinut} ${timeSlot.startTimeUnit} To ${endTimeHour}:${endTimeMinut} ${timeSlot.endTimeUnit}`;
  }

  getOrderInvoiceId() {
    this.apiService
      .request('GET_INVOICE', {
        params: { id: this.route.snapshot.params['orderId'] },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          // console.log(res);
          this.orderDetails = res.orderDetails;
          this.getOrderedItem(this.orderDetails);
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

  getOrderedItem(res) {
    this.finalOrderProducts = res.orderItemDetails;
    this.orderSubTotal = res.subTotalAmount;
    this.orderTotal = res.totalAmount;
    this.remainingAmount = res.secondPayment;
  }
}

import { Component, OnInit } from '@angular/core';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { myOrderLinks } from '../profile.config';
import { ApiService } from 'src/app/shared/services/api.service';
import { MyOrders } from 'src/app/shared/interfaces/my-orders';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  links: BreadCrumbLinks[] = myOrderLinks;
  orderDetails:MyOrders[];
  constructor( private apiService: ApiService) {}

  ngOnInit() {this.myOrderDetails();}

  myOrderDetails() {
      this.apiService.request('MY_ORDERS', { params : {} }).subscribe(
        (res) => {
          console.log(res);
          if (res && res.statusCode == 200) {
            this.orderDetails = res.allUserOrdersDetails;
          }
        },
        (error) => {
        }
      );
  }
}

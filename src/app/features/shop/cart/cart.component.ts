import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  addedProducts = [];
  orderProducts = [];
  constructor(private router: Router) {}

  ngOnInit() {
    this.defaultSetting();
  }

  defaultSetting() {
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.addedProducts.forEach((x) => {
      let index = this.orderProducts.findIndex((y) => y.id == x.id);
      if (index < 0) {
        this.orderProducts.push({
          id: x.id,
          price: x.price,
          name: x.name,
          totalPrice: x.price,
          count: 1,
          quantity: x.quantity,
        });
      } else {
        this.orderProducts[index] = {
          id: x.id,
          price: x.price,
          name: x.name,
          totalPrice: this.orderProducts[index].totalPrice + x.price,
          count: this.orderProducts[index].count + 1,
          quantity: x.quantity,
        };
      }
    });
    console.log(this.orderProducts);
  }

  makePayment() {
    this.router.navigate(['shop/checkout']);
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  addedProducts = [];
  orderProducts = [];
  orderTotal = 0;
  removeFromCartItem;
  @ViewChild('removeItemFromCartTemplate', { static: false })
  private removeItemFromCartTemplate: ElementRef;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.defaultSetting();
  }

  defaultSetting() {
    this.orderProducts = [];
    this.orderTotal = 0;
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    //to set header count
    this.commonService.cartProducts = this.addedProducts
      ? this.addedProducts.length
      : 0;
    console.log('service data', this.commonService.cartProducts);
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
    this.orderProducts.forEach((x) => {
      this.orderTotal = this.orderTotal + x.totalPrice;
    });
  }

  makePayment() {
    localStorage.setItem(
      'finalOrderProducts',
      JSON.stringify(this.orderProducts)
    );
    this.router.navigate(['shop/checkout']);
  }
  addMoreItem(item, str) {
    if (str == 'minus') {
      const index = this.addedProducts.findIndex((x) => x.id == item.id);
      this.addedProducts.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.addedProducts));
      this.defaultSetting();
    } else {
      const index = this.addedProducts.findIndex((x) => x.id == item.id);
      console.log('added part', this.addedProducts[index]);
      this.addedProducts.push(this.addedProducts[index]);
      console.log('list', this.addedProducts);
      localStorage.setItem('cart', JSON.stringify(this.addedProducts));
      this.defaultSetting();
    }
  }

  confirmBeforeRemoval(item) {
    this.removeFromCartItem = item;
    this.modalService.open(this.removeItemFromCartTemplate, {
      centered: true,
      size: 'md',
    });
  }

  removeItemFromCart() {
    this.addedProducts = this.addedProducts.filter(
      (x) => x.id !== this.removeFromCartItem.id
    );
    localStorage.setItem('cart', JSON.stringify(this.addedProducts));
    this.defaultSetting();
    this.modalService.dismissAll();
  }
}

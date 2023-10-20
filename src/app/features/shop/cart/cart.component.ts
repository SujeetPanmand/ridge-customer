import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { cartLinks } from '../shop.config';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, AfterViewInit {
  addedProducts = [];
  orderProducts = [];
  orderTotal = 0;
  removeFromCartItem;
  isStandardCut = false;
  @ViewChild('removeItemFromCartTemplate', { static: false })
  private removeItemFromCartTemplate: ElementRef;
  links: BreadCrumbLinks[] = cartLinks;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.isStandardCut =
      this.route.snapshot.queryParams['isStandardCut'] == 'true' ? true : false;
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    this.links[2].link = `/shop/cart?${substr}`;
  }

  ngAfterViewInit(): void {
    let substr = this.isStandardCut
      ? 'isStandardCut=true'
      : 'isStandardCut=false';
    this.links[2].link = `/shop/cart?${substr}`;
  }

  ngOnInit() {
    this.defaultSetting();
  }

  defaultSetting() {
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.addedProducts = this.addedProducts.filter((x) => x.count !== 0);
    this.calculateOrderTotal();
    this.setGlobalCartCount();
  }

  calculateOrderTotal() {
    this.orderTotal = 0;
    this.addedProducts.forEach((x) => {
      this.orderTotal = this.orderTotal + x.count * x.price;
    });
  }

  makePayment() {
    this.router.navigateByUrl('shop/checkout?isStandardCut=true');
  }
  addMoreItem(item, str) {
    let index = this.addedProducts.findIndex((x) => x.id === item.id);
    if (str == 'minus') {
      this.addedProducts[index].count = this.addedProducts[index].count - 1;
      this.setItemsToLocalStorage();
      if (this.addedProducts[index].count == 0) {
        this.addedProducts.splice(index, 1);
        this.commonSection(item);
      }
    } else {
      this.addedProducts[index].count = this.addedProducts[index].count + 1;
      this.setItemsToLocalStorage();
    }
    this.calculateOrderTotal();
    this.setGlobalCartCount();
  }

  confirmBeforeRemoval(item) {
    this.removeFromCartItem = item;
    this.modalService.open(this.removeItemFromCartTemplate, {
      centered: true,
      size: 'md',
    });
  }

  removeItemFromCart(item) {
    let index = this.addedProducts.findIndex((x) => x.id === item.id);
    this.addedProducts.splice(index, 1);
    this.commonSection(item);
    this.calculateOrderTotal();
    this.setGlobalCartCount();
  }

  commonSection(item) {
    let list = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    let pointer = list.findIndex((x) => x.id === item.id);
    list.splice(pointer, 1);
    localStorage.setItem('cart', JSON.stringify(list));
  }

  setGlobalCartCount() {
    let count = 0;
    this.addedProducts.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }

  setItemsToLocalStorage() {
    let list = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.addedProducts.forEach((x) => {
      list.find((item) => item.id == x.id).count = x.count;
    });
    localStorage.setItem('cart', JSON.stringify(list));
  }
}

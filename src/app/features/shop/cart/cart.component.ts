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
import { environment } from 'src/environments/environment';
import { AllCartItemDetail } from 'src/app/shared/interfaces/all-cart-item-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

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
  productPicUrl = '';
  @ViewChild('removeItemFromCartTemplate', { static: false })
  private removeItemFromCartTemplate: ElementRef;
  links: BreadCrumbLinks[] = cartLinks;
  cartItems: AllCartItemDetail[] = [];
  isLoading = false;
  isLoggedIn = 0;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.commonService.getUserDetails().then((x) => {
      this.isLoggedIn = 1;
    });
    this.getProductCart();
    this.defaultSetting();
  }

  getProductCart() {
    if (this.isLoggedIn == 1) {
      this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
        (res) => {
          if (res && res.statusCode == 200) {
            this.cartItems = res.allCartItemDetails;
          }
        },
        (error) => {}
      );
    } else {
      this.cartItems = this.commonService.getLocalCartItems();      
    }
    this.addedProducts = this.cartItems;
    this.commonService.cartProductValue.emit(this.cartItems.length ?? 0);
    this.calculateOrderTotal();
  }

  defaultSetting() {
    // this.addedProducts = JSON.parse(localStorage.getItem('cart'))
    //   ? JSON.parse(localStorage.getItem('cart'))
    //   : [];
    // this.addedProducts = this.addedProducts.filter((x) => x.count !== 0);
    this.calculateOrderTotal();
    // this.setGlobalCartCount();
  }

  calculateOrderTotal() {
    this.orderTotal = 0;
    this.cartItems.forEach((x) => {
      this.orderTotal = this.orderTotal + x.quantity * x.price;
      this.orderTotal = Number(this.orderTotal);
    });
  }

  makePayment() {
    this.router.navigateByUrl(
      'shop/checkout?isStandardCut=true&isPreorder=false'
    );
  }
  addMoreItem(item, str) {
    let index = this.addedProducts.findIndex((x) => x.id === item.id);
    if (str == 'minus') {
      item.quantity = item.quantity - 1;
      // this.setItemsToLocalStorage();
      if (item.quantity == 0) {
        this.removeCartItem(item.productId);
        this.addedProducts.splice(index, 1);
        // this.commonSection(item);
      } else {
        this.updateCartItem(item, item.quantity);
      }
    } else {
      item.quantity = item.quantity + 1;
      this.updateCartItem(item, item.quantity);
      // this.setItemsToLocalStorage();
    }
    this.calculateOrderTotal();
    this.setGlobalCartCount();
  }

  updateCartItem(product, quantity) {
    if (this.isLoggedIn == 1) {
      const apiRequest = {
        data: {
          productId: product.productId,
          quantity: quantity,
        },
      };
      this.apiService.request('ADD_CART_ITEM', apiRequest).subscribe((res) => {
        if (res && res.statusCode == 200) {
          console.log(res);
          this.getProductCart();
          this.calculateOrderTotal();
        } else {
          this.toastrService.error(res.message);
        }
      });
    } else {
      this.commonService.addLocalCartItem(quantity, product, product.productId);
      this.getProductCart();
    }
  }

  confirmBeforeRemoval(item) {
    this.removeFromCartItem = item;
    this.modalService.open(this.removeItemFromCartTemplate, {
      centered: true,
      size: 'md',
    });
  }

  removeItemFromCart(item) {
    this.isLoading = true;
    let index = this.addedProducts.findIndex(
      (x) => x.productId === item.productId
    );
    if (index != -1) {
      const itemToRemove = this.addedProducts[index];
      this.addedProducts.splice(index, 1);
      this.removeCartItem(itemToRemove.productId);
      // this.commonSection(item);
      this.calculateOrderTotal();
      this.setGlobalCartCount();
    }
  }

  removeCartItem(productId) {
    if (this.isLoggedIn == 1) {
      this.apiService
        .request('DELETE_CART_ITEMS', { params: { id: productId } })
        .subscribe((res) => {
          if (res && res.statusCode == 200) {
            this.toastrService.success('Cart Item Deleted Successfully.');
            this.getProductCart();
          }
          this.isLoading = false;
        });
    } else {
      this.commonService.removeLocalCartItem(productId);
      this.getProductCart();
      this.isLoading = false;
    }
  }

  // commonSection(item) {
  //   let list = JSON.parse(localStorage.getItem('cart'))
  //     ? JSON.parse(localStorage.getItem('cart'))
  //     : [];
  //   let pointer = list.findIndex((x) => x.id === item.id);
  //   list.splice(pointer, 1);
  //   // localStorage.setItem('cart', JSON.stringify(list));
  // }

  setGlobalCartCount() {
    let count = 0;
    this.cartItems.forEach((x) => {
      count = count + x.quantity;
    });
    this.commonService.addProducts(count);
  }

  // setItemsToLocalStorage() {
  //   let list = JSON.parse(localStorage.getItem('cart'))
  //     ? JSON.parse(localStorage.getItem('cart'))
  //     : [];
  //   this.addedProducts.forEach((x) => {
  //     list.find((item) => item.id == x.id).count = x.count;
  //   });
  //   // localStorage.setItem('cart', JSON.stringify(list));
  // }
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

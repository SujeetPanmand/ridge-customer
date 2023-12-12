import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user/user-details';
import { environment } from 'src/environments/environment';
import { AllCartItemDetail } from '../interfaces/all-cart-item-details';

export interface PaymentStatus {
  status: string;
  color: string;
}
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  cartProducts = 0;
  cartItems: AllCartItemDetail[] = [];
  isLogginShow = false;
  profilePictureUrl = 'assets/em_user.png';
  userDetails: User;
  @Output() cartProductValue = new EventEmitter<number>();
  @Output() cartItemsEvent = new EventEmitter<AllCartItemDetail[]>();
  @Output() islogginButtonShow = new EventEmitter<boolean>();
  @Output() newProfileImageEmitter = new EventEmitter<boolean>();
  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.getUserDetails();
  }
  addProducts(value) {
    this.cartProducts = value;
    this.cartProductValue.emit(value);
  }
  setCartItems(items: AllCartItemDetail[]) {
    this.cartItems = items;
    this.cartItemsEvent.emit(items);
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  getCartItemsApi() {
    return new Promise<any>(async (resolve, reject) => {
      await this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
        (res) => {
          if (res && res.statusCode == 200) {
            resolve(res.allCartItemDetails);
          }
        },
        (error) => {}
      );
    });
  }
  async setGlobalCartCount() {
    let cartItems: AllCartItemDetail[] = [];
    if (!this.isLogginShow) {
      cartItems = await this.getCartItemsApi();
    } else {
      cartItems = await this.getLocalCartItems();
    }
    await this.setCartItems(cartItems);
    await this.addProducts(cartItems.length);
  }

  getUserDetails(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      if (this.userDetails && this.userDetails.userDetails) {
        this.islogginButtonShow.emit(this.isLogginShow);
        this.setProfilePic(this.userDetails.userDetails.id);
        this.setGlobalCartCount();
        resolve(this.userDetails);
      } else {
        this.apiService.request('GET_USER_DETAILS', { params: {} }).subscribe(
          (res) => {
            if (res && res.statusCode == 200) {
              this.isLogginShow = false;
              this.islogginButtonShow.emit(this.isLogginShow);
              this.userDetails = res;
              this.setProfilePic(res.userDetails.id);
              resolve(res);
              this.setGlobalCartCount();
              localStorage.setItem('userFullName', res.userDetails.fullName);
            } else {
              resolve(null);
            }
          },
          (error) => {
            resolve(null);
            this.isLogginShow = true;
            this.islogginButtonShow.emit(this.isLogginShow);
            this.setGlobalCartCount();
          }
        );
      }
    });
  }

  setProfilePic(userId) {
    this.profilePictureUrl =
      userId != null && userId != ''
        ? environment.baseUrl + '/api/user/image/' + userId
        : 'assets/em_user.png';
  }

  getOrderStatus(num) {
    switch (num) {
      case 0:
        return { status: 'Pending', color: 'badge  badge-bg-red' };
      case 1:
        return { status: 'Delivered', color: 'badge badge-bg-gr' };
      case 2:
        return { status: 'Cancelled', color: 'badge badge-bg-red' };
      case 3:
        return { status: 'Confirmed', color: 'badge badge-bg-blue' };
      case 4:
        return { status: 'Available', color: 'badge badge-bg-gr' };
      default:
        return { status: '', color: '' };
    }
  }

  getOrderType(num) {
    switch (num) {
      case 1:
        return 'Normal';
      case 2:
        return 'PreOrder';
      default:
        return '';
    }
  }

  getCustomType(num) {
    switch (num) {
      case 1:
        return 'Standard';
      case 2:
        return 'Custom';
      default:
        return '';
    }
  }

  getPaymentStatus(num): PaymentStatus | { status: string; color: string } {
    switch (num) {
      case 1:
        return { status: 'Unpaid', color: 'badge  badge-bg-red' };
      case 2:
        return { status: 'Paid', color: 'badge  badge-bg-gr' };
      case 3:
        return { status: 'Failed', color: 'badge  badge-bg-red' };
      case 4:
        return { status: 'Partially Paid', color: 'badge  badge-bg-red' };
      default:
        return { status: 'Unknown', color: 'badge badge-bg-gray' };
    }
  }

  getLocalCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('ridgeOfflineCartItems'));
    if (cartItems === null) {
      cartItems = [];
    }
    return cartItems;
  }

  addLocalCartItem(quantity, product, productId) {
    interface productCartData {
      productId: string;
      name: string;
      cutInfo: string;
      quantity: string;
      price: string;
      totalPrice: string;
      description: string;
      productName: string;
    }

    let ridgeOfflineCartItems = JSON.parse(
      localStorage.getItem('ridgeOfflineCartItems')
    );
    if (ridgeOfflineCartItems === null) {
      ridgeOfflineCartItems = [];
      let productCart: productCartData = {
        productId: productId,
        name: product?.name,
        cutInfo: product?.cutInfo,
        quantity: quantity,
        price: product?.price,
        totalPrice: product?.price,
        description: product?.description,
        productName: product?.name,
      };
      ridgeOfflineCartItems.push(productCart);
    } else {
      let cartItemExists = false;
      let cartItemIndex = 0;
      ridgeOfflineCartItems.forEach(function (cartItem: any, index) {
        if (cartItem?.productId === productId) {
          cartItemExists = true;
          cartItem['quantity'] = quantity;
          cartItem['totalPrice'] = quantity * product?.price;
          cartItemIndex = index;
        }
      });
      if (quantity === 0) {
        ridgeOfflineCartItems.splice(cartItemIndex, 1);
      } else if (!cartItemExists) {
        let productCart: productCartData = {
          productId: productId,
          name: product?.name,
          cutInfo: product?.cutInfo,
          quantity: quantity,
          price: product?.price,
          totalPrice: product?.price,
          description: product?.description,
          productName: product?.name,
        };
        ridgeOfflineCartItems.push(productCart);
      }
    }
    this.setCartItems(ridgeOfflineCartItems);
    this.addProducts(ridgeOfflineCartItems.length);
    localStorage.setItem(
      'ridgeOfflineCartItems',
      JSON.stringify(ridgeOfflineCartItems)
    );
  }

  removeLocalCartItem(productId) {
    let ridgeOfflineCartItems = JSON.parse(
      localStorage.getItem('ridgeOfflineCartItems')
    );
    let cartItemIndex = 0;
    ridgeOfflineCartItems.forEach(function (cartItem: any, index) {
      if (cartItem?.productId === productId) {
        cartItemIndex = index;
      }
    });
    ridgeOfflineCartItems.splice(cartItemIndex, 1);
    this.setCartItems(ridgeOfflineCartItems);
    this.addProducts(ridgeOfflineCartItems.length);
    localStorage.setItem(
      'ridgeOfflineCartItems',
      JSON.stringify(ridgeOfflineCartItems)
    );
  }
  logOut() {
    localStorage.clear();
    this.userDetails = null;
    this.isLogginShow = true;
    this.cartItems = [];
    this.cartProducts = 0;
    this.cartItemsEvent.emit([]);
    this.cartProductValue.emit(0);
    this.islogginButtonShow.emit(this.isLogginShow);
  }
  onOrderConfirm() {
    this.cartItems = [];
    this.cartProducts = 0;
    this.cartItemsEvent.emit([]);
    this.cartProductValue.emit(0);
  }
}

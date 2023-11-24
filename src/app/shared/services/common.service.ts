import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user/user-details';
import { environment } from 'src/environments/environment';

export interface PaymentStatus {
  status: string;
  color: string;
}
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  cartProducts = 0;
  isLogginShow = false;
  profilePictureUrl = 'assets/em_user.png';
  userDetails: User;
  @Output() cartProductValue = new EventEmitter<number>();
  @Output() islogginButtonShow = new EventEmitter<boolean>();
  @Output() newProfileImageEmitter = new EventEmitter<boolean>();
  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.getUserDetails();
    this.setGlobalCartCount();
  }
  addProducts(value) {
    this.cartProducts = value;
    // this.cartProductValue.emit(this.cartProducts);
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  setGlobalCartCount() {
    this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          this.cartProductValue.emit(res.allCartItemDetails.length);
        }
      },
      (error) => {}
    );
  }

  getUserDetails(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.apiService.request('GET_USER_DETAILS', { params: {} }).subscribe(
        (res) => {
          if (res && res.statusCode == 200) {
            this.isLogginShow = false;
            this.islogginButtonShow.emit(this.isLogginShow);
            this.userDetails = res.userDetails;
            this.setProfilePic(res.userDetails.id);
            resolve(res);
            localStorage.setItem('userFullName', res.userDetails.fullName);
          }
        },
        (error) => {
          reject(error);
          this.isLogginShow = true;
          this.islogginButtonShow.emit(this.isLogginShow);
        }
      );
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

  getPaymentStatus(num): PaymentStatus | {status: string; color: string} {
    switch (num) {
      case 1:
        return { status: 'Pending', color: 'badge  badge-bg-red' };
      case 2:
        return { status: 'Completed', color: 'badge  badge-bg-gr' };
      case 3:
        return { status: 'Failed', color: 'badge  badge-bg-red' };
      default:
        return { status: 'Unknown', color: 'badge badge-bg-gray' };
    }
  }
}

import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user/user-details';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  cartProducts = 0;
  isLogginShow = false;
  userDetails: User;
  @Output() cartProductValue = new EventEmitter<number>();
  constructor(
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.getUserDetails();
  }
  addProducts(value) {
    this.cartProducts = value;
    this.cartProductValue.emit(this.cartProducts);
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getUserDetails(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.apiService.request('GET_USER_DETAILS', { params: {} }).subscribe(
        (res) => {
          if (res && res.statusCode == 200) {
            this.isLogginShow = false;
            this.userDetails = res.userDetails;
            resolve(res);
            localStorage.setItem('userFullName', res.userDetails.fullName);
          }
        },
        (error) => {
          this.isLogginShow = true;
          this.toastrService.error(' To avail extra facilities please log in ');
        }
      );
    });
  }
}

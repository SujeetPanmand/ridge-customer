import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user/user-details';
import { environment } from 'src/environments/environment';

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
            this.islogginButtonShow.emit(this.isLogginShow);
            this.userDetails = res.userDetails;
            this.setProfilePic(res.userDetails.id);
            resolve(res);
            localStorage.setItem('userFullName', res.userDetails.fullName);
          }
        },
        (error) => {
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
}

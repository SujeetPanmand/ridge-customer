import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { AllCartItemDetail } from 'src/app/shared/interfaces/all-cart-item-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  productList = [];
  promotionList = [];
  emailSubscribe = '';
  formSubmitAttempt: boolean = false;
  isLoggedIn = 0;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.commonService.getUserDetails().then((x) => {
      if (x) {
        this.isLoggedIn = 1;
        this.emailSubscribe = x.userDetails.email;
        const input = document.querySelector('input');
        input.setAttribute('disabled', 'true');
      }
    });
    this.commonService.gotoTop();
    this.getAllProducts();
    this.getAllPromotions();
  }

  navigateToHome() {
    this.formSubmitAttempt = true;
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let flag = emailRegex.test(this.emailSubscribe);
    console.log(flag);
    if (!this.emailSubscribe || !flag) {
      if (!flag) {
        this.showErrorMessage('Your email is incorrect.');
      }
      return;
    }
    const apiRequest = {
      data: {
        subscribeEmail: this.emailSubscribe,
      },
    };
    this.apiService.request('EMAIL_SUBSCRIBE', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.toastrService.success('Subscribe Successfully!');
      } else {
        this.toastrService.error(res.message);
      }
    });
  }

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    speed: 300,
    infinite: true,
    autoplaySpeed: 5000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  setGlobalCartCount(data) {
    let count = 0;
    data.forEach((x) => {
      count = count + x.quantity;
    });
    this.commonService.addProducts(count);
  }

  getAllProducts() {
    this.apiService
      .request('GET_ALL_PRODUCTS', { params: {} })
      .subscribe(async (res) => {
        if (res) {
          // console.log(res);
          this.productList = res.allProductDetails
            .filter((x) => x.isActive && !x.outOfStock)
            .map((e) => {
              return { ...e, url: this.setProductPic(e.id) };
            });
        }
      });
  }

  setProductPic(id) {
    let url = environment.baseUrl + '/api/product/image/' + id;

    return url ? url : 'assets/product/wholeBeef.png';
  }

  getAllPromotions() {
    this.apiService
      .request('PROMOTION_DETAILS', { params: {} })
      .subscribe(async (res) => {
        if (res) {
          this.promotionList = res.allPromotionDetails
            .filter((x) => x.isActive)
            .map((e) => {
              return { ...e, url: this.setPromotionPics(e.id) };
            });
          let defaultPromotion = {
            endDate: '',
            id: 'DEFAULT123',
            isActive: true,
            offer: 'Republic day sell',
            startDate: '',
            message: 'Default Promotion',
            url: `${environment.baseUrl}/api/promotion/image/e487ba21-7a89-4e2a-85fb-08dc1d6be929`,
          };
          this.promotionList.push(defaultPromotion);
        }
      });
  }

  setPromotionPics(id) {
    return id
      ? environment.baseUrl + '/api/promotion/image/' + id
      : 'assets/home/homepagebanner.png';
  }

  navigateToProductDetails(product) {
    this.router.navigate([`shop/product-details/${product.id}`]);
  }

  // scrollToVideo() {
  //   window.scroll({
  //     top: 1100,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  // }
  showErrorMessage(msg) {
    this.toastrService.error(msg);
  }
}

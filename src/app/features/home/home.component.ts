import { Component, OnInit } from '@angular/core';
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
  productPicUrl = '';
  promotionList = [];
  promotionPicUrl = '';
  
  constructor(
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    // let list = JSON.parse(localStorage.getItem('cart'))
    //   ? JSON.parse(localStorage.getItem('cart'))
    //   : [];
    this.commonService.gotoTop();
    this.getAllProducts();
    this.getAllPromotions();
  }

  title = 'ng-carousel-demo';

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
          this.productList = res.allProductDetails;
        }
      });
  }

  setProductPic(id) {
    let date = new Date().getTime();
    this.productPicUrl = '';
    let url = environment.baseUrl + '/api/product/image/' + id;
    this.productPicUrl = url
      ? url + '?' + date
      : 'assets/product/wholeBeef.png';

    return this.productPicUrl;
  }

  getAllPromotions() {
    this.apiService
      .request('PROMOTION_DETAILS', { params: {} })
      .subscribe(async (res) => {
        if (res) {
          console.log(res);
          this.promotionList = res.allPromotionDetails;
        }
      });
  }

  
  setPromotionPics(id) {
    let date = new Date().getTime();
    this.promotionPicUrl = '';
    let url = environment.baseUrl + '/api/promotion/image/' + id;
    this.promotionPicUrl = url
      ? url + '?' + date
      : 'assets/home/homepagebanner.png';

    return this.promotionPicUrl;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from '../shop.config';
import { findIndex } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Rating } from 'src/app/shared/interfaces/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  selctedProduct;
  addMultipe: number = 0;
  reletedProductsList = [];
  allProductReviews: Rating[] = [];
  unFilterdallProductReviews: Rating[] = [];
  addedProducts = [];
  rating = '';
  avg = 0;
  allRating = [];
  segrigatedRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  starBox = [
    { value: false, index: 1 },
    { value: false, index: 2 },
    { value: false, index: 3 },
    { value: false, index: 4 },
    { value: false, index: 5 },
  ];
  isShowWriteReviewbtn = false;
  sortkey = 'recent';

  reviewForm: FormGroup;
  formSubmitAttempt = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getProductDetails();
    this.defaultSetting();
    this.getReviewInfo();
    this.generateReviewForm();
    this.gotoTop();
  }

  generateReviewForm() {
    this.reviewForm = this.formBuilder.group({
      review: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  defaultSetting() {
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.reletedProductsList = this.addedProducts.filter((x) => x.count == 0);
    let index = this.addedProducts.findIndex(
      (x) => x.id == this.route.snapshot.params['productId']
    );
    this.addMultipe = index >= 0 ? this.addedProducts[index].count : 0;
    this.setGlobalCartCount(this.addedProducts);
  }

  getProductDetails() {
    this.apiService
      .request('GET_PRODUCT_DETAILS', {
        params: { id: this.route.snapshot.params['productId'] },
      })
      .subscribe((res) => {
        if (res) {
          this.selctedProduct = res.productDetails;
        }
      });
  }

  addMoreToCart(flag) {
    this.addMultipe = flag ? this.addMultipe + 1 : this.addMultipe - 1;
    let index = this.addedProducts.findIndex(
      (x) => x.id == this.route.snapshot.params['productId']
    );
    this.addedProducts[index].count = this.addMultipe;
    console.log(this.addedProducts);
    localStorage.setItem('cart', JSON.stringify(this.addedProducts));
    this.setGlobalCartCount(this.addedProducts);
  }

  setGlobalCartCount(addedProducts) {
    let count = 0;
    addedProducts.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }

  onNavigateToCart() {
    this.router.navigateByUrl('shop/cart?isStandardCut=true');
  }

  getReviewInfo() {
    this.segrigatedRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.apiService
      .request('REVIEW_INFO', {
        params: { productId: this.route.snapshot.params['productId'] },
      })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.allProductReviews = this.mapLikeDislikeCount(
            res.allProductReviews
          );
          this.unFilterdallProductReviews = this.mapLikeDislikeCount(
            res.allProductReviews
          );
          this.hideReviewButton();
          this.calculateAvgRating();
          this.calculateRatingWisePercentage();
        } else {
          this.toastrService.error(res.message);
        }
      });
  }

  calculateAvgRating() {
    let sum = 0;
    let count = 1;
    this.unFilterdallProductReviews.forEach((x) => {
      sum = sum + Number(x.rating);
      count++;
    });
    this.avg = sum / count;
  }

  calculateRatingWisePercentage() {
    this.unFilterdallProductReviews.forEach((x) => {
      this.allRating.push(Number(x.rating));
    });
    for (let i = 0; i < this.allRating.length; i++) {
      if (!Object.keys(this.segrigatedRating).length) {
        this.segrigatedRating[this.allRating[i]] = 1;
      } else {
        this.segrigatedRating[this.allRating[i]] =
          this.segrigatedRating[this.allRating[i]] + 1;
      }
    }
    console.log('segragetaed', this.segrigatedRating);
  }

  sortByRating() {
    console.log(this.rating);
    if (!this.rating) {
      this.allProductReviews = this.unFilterdallProductReviews;
    } else {
      this.allProductReviews = this.unFilterdallProductReviews.filter(
        (x) => x.rating == Number(this.rating)
      );
    }
  }

  getStarClass(number, rating) {
    let count = Number(rating);
    if (number <= count) {
      return 'checked';
    } else {
      return '';
    }
  }

  getPercentage(i) {
    if (this.allRating.length == 0) {
      return 0;
    } else {
      return Math.floor(
        (this.segrigatedRating[i] / this.allRating.length) * 100
      );
    }
  }

  onOpenRatePopUp(content) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  isFieldValid = (formGroup: FormGroup, field: string): boolean =>
    formGroup.get(field).invalid &&
    (this.formSubmitAttempt || formGroup.get(field).touched);

  hasError = (
    formGroup: FormGroup,
    field: string,
    errorName: string
  ): boolean =>
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  toggleStar(star) {
    if (!star.value) {
      this.checkStar(star);
    } else {
      this.unCheckStar(star);
    }
  }

  checkStar(star) {
    for (let index = 0; index <= star.index - 1; index++) {
      this.starBox[index].value = true;
    }
    console.log(this.starBox);
  }

  unCheckStar(star) {
    for (let index = star.index; index <= 4; index++) {
      this.starBox[index].value = false;
    }
  }

  submitReview() {
    this.formSubmitAttempt = true;
    if (this.reviewForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        productId: this.route.snapshot.params['productId'],
        rating: this.getRatingCount(),
        title: this.reviewForm.controls['title'].value,
        review: this.reviewForm.controls['review'].value,
      },
    };
    this.apiService.request('POST_USER_REVIEW', apiRequest).subscribe((res) => {
      this.formSubmitAttempt = false;
      this.modalService.dismissAll();
      if (res && res.statusCode == 200) {
        console.log('___', res);
        this.getReviewInfo();
      }
    });
  }

  getRatingCount() {
    let count = 0;
    this.starBox.forEach((x) => {
      if (x.value) {
        count++;
      }
    });
    return count;
  }

  hideReviewButton() {
    let name = localStorage.getItem('userFullName')
      ? localStorage.getItem('userFullName')
      : '';
    let x = this.unFilterdallProductReviews.findIndex(
      (x) => x.userDetails.fullName == name
    );
    if (x < 0) {
      this.isShowWriteReviewbtn = true;
    }
  }

  onAddReview(item, str) {
    const apiRequest = {
      data: {
        productReviewId: item.id,
        status: str == 'up' ? 1 : 0,
      },
    };
    this.apiService.request('LIKE_DISLIKE', apiRequest).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.toastrService.success(res.message);
        this.getReviewInfo();
      }
    });
  }

  mapLikeDislikeCount(data) {
    let review = data;
    review.forEach((x) => {
      let like = 0;
      let disLike = 0;
      x.productReviewFeedbackInfo.forEach((y) => {
        y.isLike ? like++ : disLike++;
      });
      x.createdAt = new Date(x.createdAt).toLocaleDateString('en-US');
      x['likeCount'] = like;
      x['disLikeCount'] = disLike;
    });

    console.log(review);

    return review;
  }
  sortReviewArray() {
    if (this.sortkey == 'recent') {
      this.allProductReviews = this.allProductReviews.sort((a, b) => {
        return <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
      });
    } else {
      this.allProductReviews = this.allProductReviews.sort((a, b) => {
        return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
      });
    }
  }
}

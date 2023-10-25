import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';

import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Rating } from 'src/app/shared/interfaces/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { prductDetailLinks } from '../shop.config';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  selctedProduct;
  addMultipe: number = 0;
  reletedProductsList = [];
  allProductReviews: Rating[] = [];
  unFilterdallProductReviews: Rating[] = [];
  addedProducts = [];
  rating = '';
  avg = 0;
  allRating = [];
  loginUserId = '';
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
  links: BreadCrumbLinks[] = prductDetailLinks;
  isEditReview = false;
  selectedReview: Rating;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.links[2].link = `/shop/product-details/${this.route.snapshot.params['productId']}`;
  }
  ngAfterViewInit(): void {
    this.links[2].link = `/shop/product-details/${this.route.snapshot.params['productId']}`;
  }

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
    this.loginUserId = localStorage.getItem('userId')
      ? localStorage.getItem('userId')
      : '';
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    let index = this.addedProducts.findIndex(
      (x) => x.id == this.route.snapshot.params['productId']
    );
    this.addMultipe = index >= 0 ? this.addedProducts[index].count : 0;
    this.setGlobalCartCount(this.addedProducts);
  }

  async getProductDetails() {
    await this.apiService
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
    if (index >= 0) {
      this.addedProducts[index].count = this.addMultipe;
    } else {
      this.selctedProduct['count'] = 1;
      this.addedProducts.push(this.selctedProduct);
    }

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

          this.calculateAvgRating();
          this.calculateRatingWisePercentage();
          this.hideReviewButton();
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
    this.avg = Math.floor(this.avg);
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
    const apiRequest = !this.isEditReview
      ? {
          data: {
            productId: this.route.snapshot.params['productId'],
            rating: this.getRatingCount(),
            title: this.reviewForm.controls['title'].value,
            review: this.reviewForm.controls['review'].value,
          },
        }
      : {
          data: {
            id: this.selectedReview.id,
            rating: this.getRatingCount(),
            title: this.reviewForm.controls['title'].value,
            review: this.reviewForm.controls['review'].value,
          },
        };
    this.apiService
      .request(
        this.isEditReview ? 'UPDATE_REVIEW' : 'POST_USER_REVIEW',
        apiRequest
      )
      .subscribe((res) => {
        this.isEditReview = false;
        this.formSubmitAttempt = false;
        this.modalService.dismissAll();
        if (res && res.statusCode == 200) {
          console.log('___', res);
          this.isShowWriteReviewbtn = false;
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
  onEditReview(content, item: Rating) {
    this.isEditReview = true;
    this.selectedReview = item;

    console.log('___', this.selectedReview);
    this.modalService.open(content, { size: 'lg', centered: true });
    this.patchEditReviewForm();
  }
  patchEditReviewForm() {
    for (let i = 0; i < this.selectedReview.rating; i++) {
      this.starBox[i].value = true;
    }
    this.reviewForm.patchValue({
      title: this.selectedReview.title,
      review: this.selectedReview.review,
    });
  }
}

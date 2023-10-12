import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from '../shop.config';
import { findIndex } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  selctedProduct;
  addMultipe: number = 0;
  reletedProductsList = [];
  addedProducts = [];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService
  ) {}
  ngOnInit() {
    this.defaultSetting();
    //this.getProductDetails();
  }
  defaultSetting() {
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    this.reletedProductsList = this.addedProducts.filter((x) => x.count == 0);
    this.selctedProduct = this.addedProducts.find(
      (x) => x.id == this.route.snapshot.params['productId']
    );
    let index = this.addedProducts.findIndex(
      (x) => x.id == this.route.snapshot.params['productId']
    );
    this.addMultipe = index >= 0 ? this.addedProducts[index].count : 0;
  }
  getProductDetails() {
    this.apiService
      .request('GET_PRODUCT_DETAILS', {
        params: { id: this.route.snapshot.params['productId'] },
      })
      .subscribe((res) => {
        if (res) {
          console.log(res);
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
}

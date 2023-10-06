import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from '../shop.config';
import { findIndex } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productList = productList;
  selctedProduct;
  addMultipe: number = 0;
  reletedProductsList = [];
  addedProducts = [];
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}
  ngOnInit() {
    this.defaultSetting();
    //this.getProductDetails();
    // this.getAllReletedProducts();
  }
  defaultSetting() {
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    this.selctedProduct = this.productList.find(
      (x) => x.id == this.route.snapshot.params['productId']
    );
    this.addedProducts.forEach((x) => {
      if (x.id == this.selctedProduct.id) {
        this.addMultipe = this.addMultipe + 1;
      }
    });
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

  getAllReletedProducts() {
    this.apiService
      .request('GET_ALL_PRODUCTS', { params: { id: '' } })
      .subscribe((res) => {
        if (res) {
          console.log(res);
        }
      });
  }

  addMoreToCart(flag) {
    this.addMultipe = flag ? this.addMultipe + 1 : this.addMultipe - 1;
    if (flag) {
      this.addedProducts.push(this.selctedProduct);
    } else {
      const index = this.addedProducts.findIndex(
        (x) => x.id == this.selctedProduct.id
      );
      this.addedProducts.splice(index, 1);
    }
    console.log(this.addedProducts);
    localStorage.setItem('cart', JSON.stringify(this.addedProducts));
  }
}

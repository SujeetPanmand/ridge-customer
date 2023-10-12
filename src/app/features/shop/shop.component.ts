import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from './shop.config';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  productList = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService
  ) {}
  ngOnInit() {
    this.getAllProducts();
  }

  defaultSetting() {
    let list = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    list.forEach((x) => {
      this.productList.find((item) => item.id == x.id).count = x.count;
    });
    this.setGlobalCartCount(list);
  }

  async getAllProducts() {
    this.apiService
      .request('GET_ALL_PRODUCTS', { params: {} })
      .subscribe(async (res) => {
        if (res) {
          console.log(res);
          this.productList = await this.formatRecords(res.allProductDetails);
          console.log(this.productList);
          this.defaultSetting();
        }
      });
  }

  formatRecords(data) {
    return data.map((x) => {
      return {
        ...x,
        count: 0,
      };
    });
  }

  navigateToProductDetail(product) {
    this.router.navigate([`shop/product-details/${product.id}`]);
  }

  addProductToCart(event, product) {
    event.stopPropagation();
    if (this.productList.length == 0) {
      this.productList.push(product);
    } else {
      const index = this.productList.findIndex((x) => x.id == product.id);
      if (index >= 0) {
        this.productList[index].count = this.productList[index].count + 1;
      } else {
        this.productList.push(product);
      }
    }

    console.log(this.productList);
    localStorage.setItem('cart', JSON.stringify(this.productList));
    this.setGlobalCartCount(this.productList);
  }

  setGlobalCartCount(data) {
    let count = 0;
    data.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }
}

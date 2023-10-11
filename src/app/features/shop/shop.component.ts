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
  productList = productList;
  addedProducts: any[] = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService
  ) {}
  ngOnInit() {
    // this.getAllProducts();
    this.addedProducts = JSON.parse(localStorage.getItem('cart'))
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }

  getAllProducts() {
    this.apiService
      .request('GET_ALL_PRODUCTS', { params: { id: '' } })
      .subscribe((res) => {
        if (res) {
          console.log(res);
        }
      });
  }
  navigateToProductDetail(product) {
    this.router.navigate([`shop/product-details/${product.id}`]);
  }
  addProductToCart(event, product) {
    event.stopPropagation();
    this.addedProducts.push(product);
    console.log(this.addedProducts);
    localStorage.setItem('cart', JSON.stringify(this.addedProducts));
    this.commonService.addProducts(this.addedProducts.length);
  }
}

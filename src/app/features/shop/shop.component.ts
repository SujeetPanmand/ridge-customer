import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from './shop.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  productList = productList;
  addedProducts = [];
  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit() {
    // this.getAllProducts();
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
  }
}

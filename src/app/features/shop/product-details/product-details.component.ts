import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from '../shop.config';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productList = productList;
  selctedProduct;
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}
  ngOnInit() {
    //this.getProductDetails();
    this.selctedProduct = this.productList.find(
      (x) => x == this.route.snapshot.params['productId']
    );
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
}

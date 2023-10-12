import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { productList } from './shop.config';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  productList = [];
  selectedProduct;
  isPreOrder = false;
  cutForm: FormGroup;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.generateCutForm();
    this.getAllProducts();
  }
  generateCutForm() {
    this.cutForm = this.formBuilder.group({
      searchCheckOption: ['standard'],
    });
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

  addProductToCart() {
    if (this.cutForm.controls['searchCheckOption'].value === 'standard') {
      if (this.productList.length == 0) {
        this.productList.push(this.selectedProduct);
      } else {
        const index = this.productList.findIndex(
          (x) => x.id == this.selectedProduct.id
        );
        if (index >= 0) {
          this.productList[index].count = this.productList[index].count + 1;
        } else {
          this.productList.push(this.selectedProduct);
        }
      }
      console.log(this.productList);
      localStorage.setItem('cart', JSON.stringify(this.productList));
      this.setGlobalCartCount(this.productList);
    } else {
      this.router.navigateByUrl('shop/checkout?isStandardCut=false');
    }
    this.modalService.dismissAll();
  }

  setGlobalCartCount(data) {
    let count = 0;
    data.forEach((x) => {
      count = count + x.count;
    });
    this.commonService.addProducts(count);
  }

  selectCut(event, content, product) {
    event.stopPropagation();
    this.selectedProduct = product;
    this.modalService.open(content, { size: 'lg', centered: true });
  }
}

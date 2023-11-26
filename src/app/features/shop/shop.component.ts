import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { shopLinks } from './shop.config';
import { environment } from 'src/environments/environment';
import {
  AllCartItemDetail,
  AllCartItemDetails,
} from 'src/app/shared/interfaces/all-cart-item-details';

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
  allCartItemDetails: AllCartItemDetails[];
  cartItems: AllCartItemDetail[] = [];
  url = '';
  productPicUrl = '';
  links: BreadCrumbLinks[] = shopLinks;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.getAllProducts();
    this.getProductCart();
    this.generateCutForm();
    this.commonService.gotoTop();
  }
  generateCutForm() {
    this.cutForm = this.formBuilder.group({
      searchCheckOption: ['standard'],
    });
  }

  defaultSetting() {
    // let list = JSON.parse(localStorage.getItem('cart'))
    //   ? JSON.parse(localStorage.getItem('cart'))
    //   : [];
    this.cartItems.forEach((x) => {
      this.productList.find((item) => item.id == x.productId).count =
        x.quantity;
    });
    this.setGlobalCartCount(this.cartItems);
  }

  async getAllProducts() {
    this.apiService.request('GET_ALL_PRODUCTS', { params: {} }).subscribe(
      async (res) => {
        if (res) {
          console.log(res);
          this.productList = await this.formatRecords(
            res.allProductDetails
          ).filter((x) => x.isActive);
          console.log(this.productList);
          // this.defaultSetting();
          this.getProductCart();
        }
      },
      (error) => {
        this.commonService.isLogginShow = true;
      }
    );
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
      if (!this.selectedProduct.outOfStock) {
        if (this.cartItems.length == 0) {
          this.cartItems.push(this.selectedProduct);
        } else {
          const index = this.cartItems.findIndex(
            (x) => x.productId == this.selectedProduct.id
          );
          if (index >= 0) {
            this.cartItems[index].quantity = this.cartItems[index].quantity + 1;
          } else {
            this.cartItems.push(this.selectedProduct);
          }
        }
        this.setProductCart(this.selectedProduct);
        localStorage.setItem('cart', JSON.stringify(this.productList));
        // this.setGlobalCartCount(this.cartItems);
      } else {
        this.apllyPreOrder();
      }
    } else {
      let arr = [];
      arr.push(this.selectedProduct);
      arr = arr.map((x) => {
        return {
          ...x,
          count: 1,
        };
      });
      localStorage.setItem('directOrderProduct', JSON.stringify(arr));
      this.selectedProduct.outOfStock
        ? this.router.navigateByUrl(
            'shop/checkout?isStandardCut=false&isPreorder=true'
          )
        : this.router.navigateByUrl(
            'shop/checkout?isStandardCut=false&isPreorder=false'
          );
    }
    this.modalService.dismissAll();
  }

  apllyPreOrder() {
    let arr = [];
    arr.push(this.selectedProduct);
    arr = arr.map((x) => {
      return {
        ...x,
        count: 1,
      };
    });
    localStorage.setItem('directOrderProduct', JSON.stringify(arr));
    this.router.navigateByUrl(
      'shop/checkout?isStandardCut=true&isPreorder=true'
    );
  }

  setProductCart(selectedProduct: any) {
    const apiRequest = {
      data: {
        productId: selectedProduct.id,
        quantity: 1,
      },
    };
    this.apiService.request('ADD_CART_ITEM', apiRequest).subscribe((res) => {
      if (res && res.statusCode == 200) {
        console.log(res);
        this.getProductCart();
      }
    });
  }

  getProductCart() {
    this.apiService.request('GET_CART_ITEMS', { params: {} }).subscribe(
      (res) => {
        if (res && res.statusCode == 200) {
          this.cartItems = res.allCartItemDetails;
          this.commonService.cartProductValue.emit(this.cartItems.length ?? 0);
          this.updateProductListCount(this.cartItems);
        }
      },
      (error) => {}
    );
  }
  updateProductListCount(data) {
    data.forEach((x) => {
      // let index = this.productList.findIndex(p=> p.id == x.productId);
      // this.productList[index].count = x.quantity;
      this.productList.forEach((item) => {
        if (item.id == x.productId) {
          item.count = x.quantity;
        }
      });
    });
    console.log(this.productList);
  }

  setGlobalCartCount(data) {
    let count = 0;
    data.forEach((x) => {
      count = count + x.quantity;
    });
    this.commonService.addProducts(count);
  }

  selectCut(event, content, product) {
    event.stopPropagation();
    this.selectedProduct = product;

    product.outOfStock
      ? product.isSample
        ? this.apllyPreOrder()
        : this.modalService.open(content, {
            size: 'lg',
            centered: true,
            backdrop: false,
          })
      : product.isSample
      ? this.updateItemCartQuantity(1, product.id)
      : this.modalService.open(content, {
          size: 'lg',
          centered: true,
          backdrop: false,
        });
  }

  imgShow(content, url) {
    this.url = url;
    this.modalService.open(content, { size: 'xl', centered: true });
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

  addMoreToCart(flag, selectedProduct) {
    selectedProduct.count = flag
      ? selectedProduct.count + 1
      : selectedProduct.count - 1;
    if (selectedProduct.count > 0) {
      this.updateItemCartQuantity(selectedProduct.count, selectedProduct.id);
    } else if (selectedProduct.count == 0) {
      this.removeCartItem(selectedProduct.id);
    }
  }

  updateItemCartQuantity(quantity, productId) {
    const apiRequest = {
      data: {
        productId: productId,
        quantity: quantity,
      },
    };
    this.apiService.request('ADD_CART_ITEM', apiRequest).subscribe((res) => {
      if (res && res.statusCode == 200) {
        console.log(res);
        this.getProductCart();
      }
    });
  }

  removeCartItem(productId) {
    this.apiService
      .request('DELETE_CART_ITEMS', { params: { id: productId } })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
        }
        this.getProductCart();
      });
  }
}

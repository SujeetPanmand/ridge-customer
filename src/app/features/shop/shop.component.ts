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
import { ToastrService } from 'ngx-toastr';

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
  isLoggedIn = 0;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.subscribeToCartItems();
  }
  subscribeToCartItems() {
    this.commonService.cartItemsEvent.subscribe((items) => {
      this.cartItems = items;
      if (this.cartItems != null) {
        this.updateProductListCount(this.cartItems);
      }
    });
  }
  ngOnInit() {
    this.commonService.getUserDetails().then((x) => {
      if (x) {
        this.isLoggedIn = 1;
      }
    });
    this.getAllProducts();
    this.generateCutForm();
    this.commonService.gotoTop();
  }
  generateCutForm() {
    this.cutForm = this.formBuilder.group({
      searchCheckOption: ['standard'],
    });
  }

  async getAllProducts() {
    this.apiService.request('GET_ALL_PRODUCTS', { params: {} }).subscribe(
      async (res) => {
        if (res) {
          console.log(res);
          this.productList = await this.formatRecords(
            res.allProductDetails
          ).filter((x) => x.isActive);
          if (this.cartItems.length) {
            this.updateProductListCount(this.cartItems);
          } else if (this.commonService.cartItems.length) {
            this.updateProductListCount(this.cartItems);
          } else {
            this.commonService.setGlobalCartCount();
          }
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

        this.updateItemCartQuantity(1, this.selectedProduct);
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
  }

  selectCut(event, content, product) {
    this.selectedProduct = product;
    event.stopPropagation();
    product.outOfStock
      ? product.isSample
        ? this.apllyPreOrder()
        : this.modalService.open(content, {
            size: 'lg',
            centered: true,
            backdrop: false,
          })
      : product.isSample
      ? this.updateItemCartQuantity(1, product)
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
      this.updateItemCartQuantity(selectedProduct.count, selectedProduct);
    } else if (selectedProduct.count == 0) {
      this.removeCartItem(selectedProduct.id);
    }
  }

  updateItemCartQuantity(quantity, product) {
    if (this.isLoggedIn == 1) {
      const apiRequest = {
        data: {
          productId: product.id,
          quantity: quantity,
        },
      };
      this.apiService.request('ADD_CART_ITEM', apiRequest).subscribe((res) => {
        if (res && res.statusCode == 200) {
          console.log(res);
          this.commonService.setGlobalCartCount();
        } else {
          this.toastrService.error(res.message);
        }
      });
    } else {
      this.commonService.addLocalCartItem(quantity, product, product.id);
    }
  }

  removeCartItem(productId) {
    if (this.isLoggedIn == 1) {
      this.apiService
        .request('DELETE_CART_ITEMS', { params: { id: productId } })
        .subscribe((res) => {
          if (res && res.statusCode == 200) {
            this.commonService.setGlobalCartCount();
          }
        });
    } else {
      this.commonService.removeLocalCartItem(productId);
    }
  }
}

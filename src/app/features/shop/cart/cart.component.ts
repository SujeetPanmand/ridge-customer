import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { cartLinks } from '../shop.config';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { environment } from 'src/environments/environment';
import { AllCartItemDetail } from 'src/app/shared/interfaces/all-cart-item-details';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  addedProducts = [];
  orderProducts = [];
  orderTotal = 0;
  removeFromCartItem;
  productPicUrl = '';
  @ViewChild('removeItemFromCartTemplate', { static: false })
  private removeItemFromCartTemplate: ElementRef;
  links: BreadCrumbLinks[] = cartLinks;
  cartItems: AllCartItemDetail[] = [];
  isLoading = false;
  isLoggedIn = 0;
  isAccordionOpen: boolean[] = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {
    this.subscribeToCartItems();
  }

  ngOnInit() {
    this.commonService.getUserDetails().then((x) => {
      if (x) this.isLoggedIn = 1;
    });

    this.defaultSetting();
  }
  subscribeToCartItems() {
    this.commonService.cartItemsEvent.subscribe((items) => {
      this.cartItems = items;
      this.addedProducts = this.cartItems;
      this.calculateOrderTotal();
    });
  }

  toggleAccordion(index: number) {
    // Toggle the clicked accordion
    this.isAccordionOpen[index] = !this.isAccordionOpen[index];

    // Close all other accordions
    for (let i = 0; i < this.isAccordionOpen.length; i++) {
      if (i !== index) {
        this.isAccordionOpen[i] = false;
      }
    }
  }

  defaultSetting() {
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    this.orderTotal = 0;
    this.cartItems.forEach((x) => {
      this.orderTotal = this.orderTotal + x.quantity * x.price;
      this.orderTotal = Number(this.orderTotal);
    });
  }

  makePayment() {
    this.router.navigateByUrl(
      'shop/checkout?isStandardCut=true&isPreorder=false'
    );
  }
  addMoreItem(item, str) {
    let index = this.addedProducts.findIndex((x) => x.id === item.id);
    if (str == 'minus') {
      item.quantity = item.quantity - 1;
      if (item.quantity == 0) {
        this.removeCartItem(item.productId);
        this.addedProducts.splice(index, 1);
      } else {
        this.updateCartItem(item, item.quantity);
      }
    } else {
      item.quantity = item.quantity + 1;
      this.updateCartItem(item, item.quantity);
    }
    this.calculateOrderTotal();
    this.commonService.setGlobalCartCount();
  }

  updateCartItem(product, quantity) {
    if (this.isLoggedIn == 1) {
      const apiRequest = {
        data: {
          productId: product.productId,
          quantity: quantity,
        },
      };
      this.apiService.request('ADD_CART_ITEM', apiRequest).subscribe((res) => {
        if (res && res.statusCode == 200) {
          console.log(res);
          this.commonService.setGlobalCartCount();
          this.calculateOrderTotal();
        } else {
          this.toastrService.error(res.message);
        }
      });
    } else {
      this.commonService.addLocalCartItem(quantity, product, product.productId);
    }
  }

  confirmBeforeRemoval(item) {
    this.removeFromCartItem = item;
    this.modalService.open(this.removeItemFromCartTemplate, {
      centered: true,
      size: 'md',
    });
  }

  removeItemFromCart(item) {
    this.isLoading = true;
    let index = this.addedProducts.findIndex(
      (x) => x.productId === item.productId
    );
    if (index != -1) {
      const itemToRemove = this.addedProducts[index];
      this.addedProducts.splice(index, 1);
      this.removeCartItem(itemToRemove.productId);
      this.calculateOrderTotal();
      this.commonService.setGlobalCartCount();
    }
  }

  removeCartItem(productId) {
    if (this.isLoggedIn == 1) {
      this.apiService
        .request('DELETE_CART_ITEMS', { params: { id: productId } })
        .subscribe((res) => {
          if (res && res.statusCode == 200) {
            this.toastrService.success('Cart Item Deleted Successfully.');
            this.commonService.setGlobalCartCount();
          }
          this.isLoading = false;
        });
    } else {
      this.commonService.removeLocalCartItem(productId);
      this.isLoading = false;
    }
  }

  setProductPic(id) {
    return id
      ? environment.baseUrl + '/api/product/image/' + id
      : 'assets/product/wholeBeef.png';
  }
}

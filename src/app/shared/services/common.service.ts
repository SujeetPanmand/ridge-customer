import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  cartProducts = 0;
  isLogginShow = false;
  @Output() cartProductValue = new EventEmitter<number>();
  constructor() {}
  addProducts(value) {
    this.cartProducts = value;
    this.cartProductValue.emit(this.cartProducts);
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}

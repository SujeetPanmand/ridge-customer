import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  cartProducts = 0;
  @Output() cartProductValue = new EventEmitter<number>();
  constructor() {}
  addProducts(value) {
    this.cartProducts = value;
    this.cartProductValue.emit(this.cartProducts);
  }
}

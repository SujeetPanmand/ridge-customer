import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'cart/checkout',
    component: CheckoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}

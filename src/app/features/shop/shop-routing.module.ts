import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OrderPaymentComponent } from './order-payment/order-payment.component';

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
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'order-confirmation/:orderId',
    component: OrderConfirmationComponent,
  },
  {
    path: 'product-details/:productId',
    component: ProductDetailsComponent,
  },
  {
    path: 'order-payment/:orderId',
    component: OrderPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';
@NgModule({
  declarations: [ShopComponent],
  imports: [CommonModule, ShopRoutingModule, SharedModule],
})
export class ShopModule {}
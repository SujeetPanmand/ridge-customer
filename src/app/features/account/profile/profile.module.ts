import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    MyAccountComponent,
    MyOrdersComponent,
    EditAddressComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}

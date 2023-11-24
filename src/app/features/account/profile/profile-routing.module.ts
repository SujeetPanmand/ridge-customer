import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ProfileComponent } from './profile.component';


const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'my-account',
        pathMatch: 'full',
      },
      {
        path: 'my-account',
        component: MyAccountComponent,
      },
      {
        path: 'edit-address',
        component: EditAddressComponent,
      },
      {
        path: 'my-orders',
        component: MyOrdersComponent,
        
      },
      
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}

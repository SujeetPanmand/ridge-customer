import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './features/account/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.module').then((a) => a.HomeModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/account/account.module').then(
            (a) => a.AccountModule
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./features/about/about.module').then((a) => a.AboutModule),
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./features/shop/shop.module').then((a) => a.ShopModule),
      },
      {
        path: 'product-details',
        loadChildren: () =>
          import('./features/product-details/product-details.module').then(
            (a) => a.ProductDetailsModule
          ),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./features/blog/blog.module').then((a) => a.BlogModule),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.module').then((a) => a.ContactModule),
      },
      {
        path: '*',
        redirectTo: '/',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '*',
        redirectTo: '/',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.module').then((a) => a.HomeModule),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./features/about/about.module').then((a) => a.AboutModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/account/account.module').then(
            (a) => a.AccountModule
          ),
      },

      {
        path: 'shop',
        loadChildren: () =>
          import('./features/shop/shop.module').then((a) => a.ShopModule),
      },

      {
        path: 'blog',
        loadChildren: () =>
          import('./features/blog/blog.module').then((a) => a.BlogModule),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.module').then(
            (a) => a.ContactModule
          ),
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

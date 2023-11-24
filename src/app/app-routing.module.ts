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
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./features/account/account.module').then(
            (a) => a.AccountModule
          ),
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
      { path: '**', redirectTo: '/account/login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

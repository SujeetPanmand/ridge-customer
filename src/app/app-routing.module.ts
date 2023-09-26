import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'account',
        loadChildren: () =>
          import('./features/account/account.module').then(
            (a) => a.AccountModule
          ),
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

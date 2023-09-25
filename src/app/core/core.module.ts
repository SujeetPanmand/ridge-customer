import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/services/auth.interceptor';
import { HTTPListener } from '../shared/services/loading.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from './layout/layout.module';

const RxJS_Services = [HTTPListener];
@NgModule({
  declarations: [],
  imports: [CommonModule, LayoutModule, SharedModule],
  providers: [
    ...RxJS_Services,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}

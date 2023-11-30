import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadCrumbComponent } from './component/bread-crumb/bread-crumb.component';
import { ConfirmationPopUpComponent } from './component/confirmation-pop-up/confirmation-pop-up.component';
import { DataTablesModule } from 'angular-datatables';
import { LoaderComponent } from './component/loader/loader.component';

@NgModule({
  declarations: [
    BreadCrumbComponent,
    ConfirmationPopUpComponent,
    LoaderComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    ToastrModule.forRoot({ timeOut: 1500 }),
    DataTablesModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule,
    NgbModule,
    BreadCrumbComponent,
    DataTablesModule,
    LoaderComponent,
  ],
  providers: [ToastrService, NgbActiveModal],
})
export class SharedModule {}

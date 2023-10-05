import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonService } from './services/common.service';

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule.forRoot(),
  ],
  exports: [FormsModule, ReactiveFormsModule, CommonModule, ToastrModule],
  providers: [ToastrService, CommonService],
})
export class SharedModule {}

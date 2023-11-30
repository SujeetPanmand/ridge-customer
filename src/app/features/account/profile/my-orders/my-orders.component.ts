import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';
import { myOrderLinks } from '../profile.config';
import { ApiService } from 'src/app/shared/services/api.service';
import { MyOrders } from 'src/app/shared/interfaces/my-orders';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit, AfterViewInit {
  links: BreadCrumbLinks[] = myOrderLinks;
  orderDetails: MyOrders[] = [];
  reason = '';
  cancelReasonForm: FormGroup;
  cancelReasonFormSubmitAttempt: boolean = false;
  cancelReason: string = '';
  selectedOrderId: string = '';
  isLoading = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public commonService: CommonService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    this.dtTrigger.next(this.orderDetails);
  }

  ngOnInit() {
    this.dtOptions = {
      paging: true,
      fixedColumns: true,
      order: [[1, 'asc']],
      autoWidth: true,

      select: false,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.myOrderDetails();
    this.saveCancelReasonForm();
  }

  saveCancelReasonForm() {
    this.cancelReasonForm = this.formBuilder.group({
      cancelReason: ['', Validators.required],
    });
  }

  isFieldValid = (formGroup: FormGroup, field: string): boolean =>
    formGroup.get(field).invalid &&
    (this.cancelReasonFormSubmitAttempt || formGroup.get(field).touched);

  hasError = (
    formGroup: FormGroup,
    field: string,
    errorName: string
  ): boolean =>
    formGroup.get(field).errors && formGroup.get(field).touched
      ? formGroup.get(field).errors[errorName]
      : false;

  myOrderDetails() {
    this.isLoading = true;
    this.apiService.request('MY_ORDERS', { params: {} }).subscribe((res) => {
      console.log(res);
      this.isLoading = false;
      if (res && res.statusCode == 200) {
        this.orderDetails = res.allUserOrdersDetails;
        // this.dtTrigger.next(this.orderDetails);
      }
    });
  }

  navigateToDetails(orderId: any) {
    this.router.navigate([`account/order-details/${orderId}`]);
  }
  openCancelDialog(content, selectedOrderDetails) {
    console.log(selectedOrderDetails.id);
    this.selectedOrderId = selectedOrderDetails.id;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  cancelOrder() {
    this.cancelReasonFormSubmitAttempt = true;
    if (this.cancelReasonForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        cancelledReason: this.cancelReason,
        id: this.selectedOrderId,
      },
    };
    this.apiService.request('CANCEL_ORDER', apiRequest).subscribe((res) => {
      this.cancelReasonFormSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.myOrderDetails();
        this.commonService.gotoTop();
        this.toastrService.success('Updated Successfully!');
        this.modalService.dismissAll();
      } else if (res.statusCode == 404) {
        this.toastrService.error(res.message);
      } else {
        this.toastrService.error('Something went wrong.');
      }
    });
  }
}

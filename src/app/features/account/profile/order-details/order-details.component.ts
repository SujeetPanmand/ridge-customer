import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationPopUpComponent } from 'src/app/shared/component/confirmation-pop-up/confirmation-pop-up.component';
import { MyOrders } from 'src/app/shared/interfaces/my-orders';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
  @ViewChild('canelOrderTemplate', { static: false })
  private canelOrderTemplate: ElementRef;
  selectedOrder: any;
  cancelReasonForm: FormGroup;
  cancelReason: string = '';
  cancelReasonFormSubmitAttempt: boolean = false;
  expectedDeliveryDate = '';
  orderId = '';
  isLoggedIn = 0;
  subTotal = 0;
  orderTotal = 0;
  remainingAmount = 0;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    public commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router // private datePipe: DatePipe
  ) {}
  ngOnInit() {
    this.commonService.getUserDetails().then((x) => {
      if (x) this.isLoggedIn = 1;
    });

    this.orderId = this.route.snapshot.params['orderId'];

    if (this.orderId != '') {
      this.getOrderDetails();
      this.saveCancelReasonForm();
    }
  }
  formatTime(timeSlot: any): string {
    if (!timeSlot) {
      return '--';
    }
    const startTimeHour =
      timeSlot.startTimeHour < 10
        ? '0' + timeSlot.startTimeHour
        : timeSlot.startTimeHour;
    const startTimeMinut =
      timeSlot.startTimeMinut < 10
        ? '0' + timeSlot.startTimeMinut
        : timeSlot.startTimeMinut;
    const endTimeHour =
      timeSlot.endTimeHour < 10
        ? '0' + timeSlot.endTimeHour
        : timeSlot.endTimeHour;
    const endTimeMinut =
      timeSlot.endTimeMinut < 10
        ? '0' + timeSlot.endTimeMinut
        : timeSlot.endTimeMinut;

    return `${startTimeHour}:${startTimeMinut} ${timeSlot.startTimeUnit} To ${endTimeHour}:${endTimeMinut} ${timeSlot.endTimeUnit}`;
  }
  getOrderDetails() {
    this.apiService
      .request('ORDER_DETAILS', { params: { id: this.orderId } })
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.selectedOrder = res.orderDetails;
          this.getTotalAndSubTotal(this.selectedOrder);
          // this.expectedDeliveryDate = this.datePipe.transform(
          //   new Date(this.selectedOrder.expectedDeliveryDate),
          //   'YYYY-MM-dd'
          // );
        }
      });
  }

  saveCancelReasonForm() {
    this.cancelReasonForm = this.formBuilder.group({
      cancelReason: ['', Validators.required],
    });
  }
  printInvoice() {
    window.print();
  }
  confirmDeliveredOrder() {
    let id = [];
    id.push(this.selectedOrder.id);

    let data = {
      action_button_name: 'Yes',
      title_text: 'Confirmation',
      text: `Are you sure want to mark the order ${this.selectedOrder.id} as delivered?`,
    };
    let modelRef = this.modalService.open(ConfirmationPopUpComponent, {
      size: 'md',
      centered: true,
    });
    modelRef.componentInstance.data = data;

    modelRef.result.then((res) => {
      if (res) {
        this.apiService
          .request('MARK_AS_DELIVERED_ORDER', {
            data: { orderIds: id, featureForAdmin: true },
          })
          .subscribe((res) => {
            if (res && res.statusCode == 200) {
              this.toastrService.success(
                'Mark as selivered order successfully'
              );

              // this.router.navigate(['/orders']);
            }
          });
      }
    });
  }

  openCancelDialog(flag) {
    this.cancelReason = '';
    this.modalService.open(this.canelOrderTemplate, {
      size: 'md',
      centered: true,
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

  cancelOrder() {
    this.cancelReasonFormSubmitAttempt = true;
    if (this.cancelReasonForm.invalid) {
      return;
    }
    const apiRequest = {
      data: {
        cancelledReason: this.cancelReason,
        id: this.selectedOrder.id,
      },
    };

    this.apiService.request('CANCEL_ORDER', apiRequest).subscribe((res) => {
      this.cancelReasonFormSubmitAttempt = false;
      if (res && res.statusCode == 200) {
        this.toastrService.success('Order cancelled successfully.');
        this.getOrderDetails();
        this.modalService.dismissAll();
      }
    });
  }

  navigateToSecondPayment() {
    let url = `shop/order-payment/${this.selectedOrder?.id.trim()}`;
    this.router.navigate([url]);
  }
  getTotalAndSubTotal(order) {
    this.subTotal = order.subTotalAmount;
    this.orderTotal = order.totalAmount;
    this.remainingAmount = order.secondPayment;
  }
}

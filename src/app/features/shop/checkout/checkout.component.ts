import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  isSelfPickUp = false;
  ngOnInit() {}
  onChangeType(flag) {
    this.isSelfPickUp = flag;
  }
}

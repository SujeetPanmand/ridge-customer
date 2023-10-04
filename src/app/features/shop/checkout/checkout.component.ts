import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  selfPickupCheckbox: HTMLInputElement; // Declare the variable here

  ngOnInit() {
    // Add an event listener to the "Self Pickup" checkbox
    this.selfPickupCheckbox = document.getElementById(
      'selfPickup'
    ) as HTMLInputElement;
    const deliveryOptions = document.getElementById('deliveryOptions');
    const shippingAddress = document.getElementById('shippingAddress');
    this.selfPickupCheckbox.addEventListener('change', () => {
      if (this.selfPickupCheckbox.checked) {
        // If the checkbox is checked (self pickup selected), hide the delivery options
        deliveryOptions.style.display = 'block';
        shippingAddress.style.display = 'none';
      } else {
        // If the checkbox is unchecked (delivery selected), show the delivery options
        deliveryOptions.style.display = 'none';
        shippingAddress.style.display = 'block';
      }
    });
  }
}

export interface OrderDetails {
  id?: string;
  user?: User;
  address1?: string;
  address2?: string;
  subTotalAmount?: number;
  secondPayment?:number;
  tax?: number;
  shippingCharge?: number;
  totalAmount?: number;
  paymentStatus?: number;
  paymentDate?:Date;
  slot?: Slot;
  pickupSlot?: null;
  orderStatus?: number;
  orderType?: number;
  cutType?: number;
  orderItemDetails?: OrderItemDetail[];
  isSelfPickup?: boolean;
  expectedDeliveryDate?: Date;
  city?: string;
  state?: string;
  country?: string;
  sameAsBillingAddress?: boolean;
  isSaveAddress?: boolean;
  company?: string;
  orderId?: string;
  createdAt?: Date;
}

export interface OrderItemDetail {
  product?: string;
  name?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface Slot {
  id?: string;
  startTimeHour?: number;
  startTimeMinut?: number;
  startTimeUnit?: string;
  endTimeHour?: number;
  endTimeMinut?: number;
  endTimeUnit?: string;
  day?: number;
  orderCount?: number;
}

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

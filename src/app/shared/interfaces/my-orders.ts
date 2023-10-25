export interface MyOrders {
    id?: string;
    user?:UserOrder[];
    address1?:string;
    address2?:string;
    subTotalAmount?:number;
    tax?:number;
    totalAmount?:number;
    paymentStatus?:number;
    slot?:SlotOrder[];
    orderStatus?:string;
    orderType?:string;
    orderItemDetails?:OrderItemDetail[];
    isSelfPickup?:boolean;
    expectedDeliveryDate?:string;
    city?:string;
    state?:string;
    country?:string;
    sameAsBillingAddress?:boolean;
    isSaveAddress?:boolean;
    firstName?:string;
    lastName?:string;
    emailAddress?:string;
    company?:string;
}
export interface UserOrder{
    id?:string;
    name?:string;
}
export interface SlotOrder{
    id?:string;
    startTime?:string;
    endTime?:string;
    orderCount?:number;
}
export interface OrderItemDetail{
    product?:string;
    name?:string;
    quantity?:number;
}
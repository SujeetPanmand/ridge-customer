import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';

export const dayList = [
  { key: 1, day: 'sunday' },
  { key: 2, day: 'monday' },
  { key: 3, day: 'tuesday' },
  { key: 4, day: 'wednesday' },
  { key: 5, day: 'thursday' },
  { key: 6, day: 'friday' },
  { key: 7, day: 'saturday' },
];

export const shopLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Shop',
    link: '/shop',
  },
];

export const prductDetailLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Shop',
    link: '/shop',
  },
  {
    name: 'Product Details',
    link: '/shop/product-details/id',
  },
];

export const cartLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Shop',
    link: '/shop',
  },
  {
    name: 'Cart',
    link: '/shop/cart',
  },
];
export const checkoutLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Shop',
    link: '/shop',
  },
  {
    name: 'Checkout',
    link: '/shop/checkout?isStandardCut=true',
  },
];
export const paymentLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Shop',
    link: '/shop',
  },
  {
    name: 'Checkout',
    link: '/shop/checkout',
  },
  {
    name: 'Payment',
    link: '/shop/payment',
  },
];

export const partialPaymentLinks: BreadCrumbLinks[] = [
  {
    name: 'My Orders',
    link: '/account/profile/my-orders',
  },
  {
    name: 'Order Details',
    link: '/account/order-details',
  },
  {
    name: 'Partial Payment',
    link: '/shop/order-payment',
  },
];
export const orderConfirmationLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Shop',
    link: '/shop',
  },
  {
    name: 'Order Confirmation',
    link: '/shop/order-confirmation/id?isStandardCut=true',
  },
];

export const cartTypes = [
  {
    name: 'AMEX',
    expressions: [{ pattern: new RegExp('^3[47][0-9]{13}$') }],
    image: 'assets/creditCardImg/amex.png',
  },
  {
    name: 'VISA',
    expressions: [{ pattern: new RegExp('^4[0-9]{12}(?:[0-9]{3})?$') }],
    image: 'assets/creditCardImg/visa.png',
  },
  {
    name: 'MASTERCARD',
    expressions: [
      { pattern: new RegExp('^5[1-5][0-9]{14}$') },
      { pattern: new RegExp('^2[2-7][0-9]{14}$') },
    ],
    image: 'assets/creditCardImg/mastercard.png',
  },
  {
    name: 'DISCOVER',
    expressions: [
      { pattern: new RegExp('^6011[0-9]{12}[0-9]*$') },
      { pattern: new RegExp('^62[24568][0-9]{13}[0-9]*$') },
      { pattern: new RegExp('^6[45][0-9]{14}[0-9]*$') },
    ],
    image: 'assets/creditCardImg/discover.png',
  },
  {
    name: 'DINERS',
    expressions: [{ pattern: new RegExp('^3[0689][0-9]{12}[0-9]*$') }],
    image: 'assets/creditCardImg/diners.png',
  },
  {
    name: 'JCB',
    expressions: [{ pattern: new RegExp('^35[0-9]{14}[0-9]*$') }],
    image: 'assets/creditCardImg/jcb.png',
  },
];

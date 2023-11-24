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
    link: '/shop/cart?isStandardCut=true',
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
    name: 'Payment',
    link: '/shop/payment',
  },
  {
    name: 'OrderPayment',
    link: '/shop/order-payment?id=SPAR77',
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

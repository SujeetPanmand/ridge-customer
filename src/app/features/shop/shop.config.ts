import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';

export const dayList = [
  { key: 0, day: 'sunday' },
  { key: 1, day: 'monday' },
  { key: 2, day: 'tuesday' },
  { key: 3, day: 'wednesday' },
  { key: 4, day: 'thursday' },
  { key: 5, day: 'friday' },
  { key: 6, day: 'saturday' },
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

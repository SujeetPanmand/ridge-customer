import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';

export const myAccountlinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'My Account',
    link: 'account/profile/my-account',
  },
];

export const myAddressLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Edit Address',
    link: 'account/profile/edit-address',
  },
];

export const myOrderLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'My Orders',
    link: 'account/profile/my-orders',
  },
];

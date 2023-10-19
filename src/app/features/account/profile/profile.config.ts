import { BreadCrumbLinks } from 'src/app/shared/interfaces/breadcrumb';

export const myAccountlinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'My Account',
    link: '/profile/my-account',
  },
];

export const myAddressLinks: BreadCrumbLinks[] = [
  {
    name: 'Home',
    link: '/home',
  },
  {
    name: 'Edit Address',
    link: '/profile/edit-address',
  },
];

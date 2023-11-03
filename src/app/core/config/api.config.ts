import { environment } from 'src/environments/environment';
const authEndPoint = [
  {
    name: 'USER_LOGIN',
    method: 'POST',
    url: environment.baseUrl + '/api/auth/sign-in',
  },
  {
    name: 'USER_SIGN_UP',
    method: 'POST',
    url: environment.baseUrl + '/api/auth/sign-up',
  },
  {
    name: 'FORGOT_PASSWORD',
    method: 'POST',
    url: environment.baseUrl + '/api/auth/customer-forgot-password',
  },
  {
    name: 'RESET_PASSWORD',
    method: 'POST',
    url: environment.baseUrl + '/api/auth/reset-password',
  },
  {
    name: 'GET_USER_DETAILS',
    method: 'GET',
    url: environment.baseUrl + '/api/user/me',
  },
];

const shopEndPoints = [
  {
    name: 'GET_ALL_PRODUCTS',
    method: 'GET',
    url: environment.baseUrl + '/api/product',
  },
  {
    name: 'GET_PRODUCT_DETAILS',
    method: 'GET',
    url: environment.baseUrl + '/api/product/[id]',
  },
  {
    name: 'REVIEW_INFO',
    method: 'GET',
    url: environment.baseUrl + '/api/productReview/[productId]',
  },
  {
    name: 'POST_USER_REVIEW',
    method: 'POST',
    url: environment.baseUrl + '/api/productReview/add-productReview',
  },
  {
    name: 'UPDATE_REVIEW',
    method: 'PUT',
    url: environment.baseUrl + '/api/productReview/update',
  },
  {
    name: 'DELETE_REVIEW',
    method: 'DELETE',
    url: environment.baseUrl + '/api/productReview/[id]',
  },
  {
    name: 'LIKE_DISLIKE',
    method: 'POST',
    url: environment.baseUrl + '/api/productReview/setlikeStatus',
  },
  {
    name: 'MY_ORDERS',
    method: 'GET',
    url: environment.baseUrl + '/api/order/my-orders',
  },
  {
    name: 'CANCEL_ORDER',
    method: 'PUT',
    url: environment.baseUrl + '/api/order/cancel-order'
  }
];

const contactEndPoints = [
  {
    name: 'CONTACT_US',
    method: 'POST',
    url: environment.baseUrl + '/api/contactUs/add-contactUs',
  },
];
const blogEndPoint = [
  {
    name: 'GET_ALL_BLOGS',
    method: 'GET',
    url: environment.baseUrl + '/api/blog',
  },
];

const accountEndPoints = [
  {
    name: 'UPDATE_ACCOUNT_INFO',
    method: 'PUT',
    url: environment.baseUrl + '/api/user',
  },
  {
    name: 'UPDATE_ADDRESS',
    method: 'PUT',
    url: environment.baseUrl + '/api/user/update-address',
  },
  {
    name: 'EDIT_PROFILE_IMAGE',
    method: 'PUT',
    url: environment.baseUrl + '/api/user/update-image',
  },
  {
    name: 'GET_ZIPCODE_DETAILS',
    method: 'GET',
    url: environment.baseUrl + '/api/zipcodes/[zipcode]'
  }
];
const paymentEndPoints = [
  {
    name: 'GET_SLOTS',
    method: 'GET',
    url: environment.baseUrl + '/api/slot/get-slot',
  },
];

export const ApiConfig = {
  baseUrl: '',
  endpoints: [
    ...authEndPoint,
    ...shopEndPoints,
    ...contactEndPoints,
    ...blogEndPoint,
    ...accountEndPoints,
    ...paymentEndPoints,
  ],
};

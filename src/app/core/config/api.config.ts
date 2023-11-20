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
    url: environment.baseUrl + '/api/order/cancel-order',
  },
  {
    name: 'ADD_CART_ITEM',
    method: 'POST',
    url: environment.baseUrl + '/api/cartItem/add-cart-item',
  },
  {
    name: 'GET_CART_ITEMS',
    method: 'GET',
    url: environment.baseUrl + '/api/cartItem/get-cart-items',
  },
  {
    name: 'DELETE_CART_ITEMS',
    method: 'DELETE',
    url: environment.baseUrl + '/api/cartItem/delete/[id]',
  },
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
  {
    name: 'GET_BLOG_DETAILS_BY_ID',
    method: 'GET',
    url: environment.baseUrl + '/api/blog/[id]',
  },
  {
    name: 'GET_ALL_COMMENT',
    method: 'GET',
    url: environment.baseUrl + '/api/comment/get-blog-comments/[id]',
  },
  {
    name: 'ADD_COMMENT',
    method: 'POST',
    url: environment.baseUrl + '/api/comment/add-comment',
  },
  {
    name: 'GET_ALL_TAGS',
    method: 'GET',
    url: environment.baseUrl + '/api/tag',
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
    url: environment.baseUrl + '/api/zipcodes/[zipcode]',
  },
];
const slotEndPoints = [
  {
    name: 'GET_DELIVERY_SLOTS',
    method: 'GET',
    url: environment.baseUrl + '/api/slot/get-slot',
  },
  {
    name: 'GET_PICKUP_SLOTS',
    method: 'GET',
    url: environment.baseUrl + '/api/pickup-slot/get',
  },
];

const homeEndPoints = [
  {
    name: 'PROMOTION_DETAILS',
    method: 'GET',
    url: environment.baseUrl + '/api/promotion/get',
  },
];
const orderCreateEndPoints = [
  {
    name: 'CREATE_ORDER',
    method: 'POST',
    url: environment.baseUrl + '/api/order/create-order',
  },
];
const subscribeEndPoint = [
  {
    name: 'EMAIL_SUBSCRIBE',
    method: 'POST',
    url: environment.baseUrl + '/api/subscribe/subscribe-user',
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
    ...slotEndPoints,
    ...homeEndPoints,
    ...orderCreateEndPoints,
    ...subscribeEndPoint,
  ],
};

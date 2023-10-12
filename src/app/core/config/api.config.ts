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
];

const contactEndPoints = [
  {
    name: 'CONTACT_US',
    method: 'POST',
    url: environment.baseUrl + '/api/contactUs/add-contactUs',
  },
];

export const ApiConfig = {
  baseUrl: '',
  endpoints: [...authEndPoint, ...shopEndPoints, ...contactEndPoints],
};

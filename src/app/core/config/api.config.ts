import { environment } from 'src/environments/environment';
const authEndPoint = [
  {
    name: 'USER_LOGIN',
    method: 'POST',
    url: environment.baseUrl + '/api/auth/sign-in',
  },
];
export const ApiConfig = {
  baseUrl: '',
  endpoints: [...authEndPoint],
};

import { environment } from 'src/environments/environment';
const authEndPoint = [
  {
    name: 'USER_LOGIN',
    method: 'POST',
    url: environment.baseUrl + '/api/auth/login',
  },
];
export const ApiConfig = {
  baseUrl: '',
  endpoints: [...authEndPoint],
};

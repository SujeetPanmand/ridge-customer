export interface User {
  message: string;
  statusCode: number;
  userDetails: UserDetails;
}

export interface UserDetails {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressList: Address[];
}

export interface Address {
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}

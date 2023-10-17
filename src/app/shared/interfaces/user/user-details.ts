export interface User {
  message: string;
  statusCode: string;
  userDetails: UserDetails;
}

export interface UserDetails {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: Address[];
}

export interface Address {
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}

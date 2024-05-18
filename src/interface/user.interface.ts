export interface UserTokenDetails {
  sub: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface UserDetails {
  email: string;
  firstName: string;
  passwordHash: string;
  lastName: string;
  otherName: string;
}

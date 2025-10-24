// export interface AuthUserProfileAttributesModel {
//   firstName: string;
// }

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  name: string;
  email: string;
  password: string;
  address: string;
  country: string;
  city: string;
  contactNumber: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface AuthUserResponse {
  accessToken: string;
  refreshToken: string;
}

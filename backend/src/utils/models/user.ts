export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  name: string;
  email: string;
  password: string;
  address: string;
  country: string;
  city: string;
  contact_number: string;
  role: string;
  created_at: Date;
  update_at: Date;
}

export interface UserResponse {
  id: string;
  type: string;
  attributes: User;
  token: string;
}

export interface RegisterFormGeneral {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  email: string;
  username: string;
  password: string;
  cPassword: string;
  sponsor: string;
  upline: string;
  position: string;
}

export interface ActivationCode {
  pin: string;
}

export const RegisterEmptyForm: RegisterFormGeneral = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  email: '',
  username: '',
  password: '',
  cPassword: '',
  sponsor: '',
  position: '',
  upline: '',
};

export const ActivationCodeEmpty: ActivationCode = {
  pin: '',
};

export interface Document<Type> {
  data?: Type | Type[];
  errors?: string;
  meta?: string;
  included?: any[];
}

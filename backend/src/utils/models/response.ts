export type SuccessResponse<T = undefined> = {
  statusCode: number;
  message: string;
  data?: T;
};

export type ErrorResponse = {
  statusCode: number;
  errorMessage: string;
};

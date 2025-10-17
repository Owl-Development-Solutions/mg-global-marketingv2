import { getAllUsersGeonology } from '../../infrastructure';
import { ErrorResponse, Result, SuccessResponse, User } from '../../utils';
import { Request, Response } from 'express';

export const getGeonology = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<User[]>,
    ErrorResponse
  > = await getAllUsersGeonology();

  if (!result.success) {
    res.status(result.error.statusCode).json({
      error: result.error.errorMessage,
    });

    return;
  }

  res.status(result.data.statusCode).json({
    message: result.data.message,
    data: result.data.data,
  });
};

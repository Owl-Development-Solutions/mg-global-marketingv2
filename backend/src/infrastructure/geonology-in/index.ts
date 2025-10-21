import { ErrorResponse, Result, SuccessResponse, User } from "../../utils";
import { sampleUsers } from "../../utils/sampleDatasz";

export const getAllUsersGeonology = async (): Promise<
  Result<SuccessResponse<User[]>, ErrorResponse>
> => {
  try {
    //logic goes here

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "user successfully get",
        data: sampleUsers,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

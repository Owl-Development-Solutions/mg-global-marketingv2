import { Request, Response } from "express";
import { ErrorResponse, Result, SuccessResponse } from "../../utils";
import { uploadImage } from "../../infrastructure";

export const imageUploadController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log(req.body);
  console.log(req.file);

  const data = {
    userId: req.body.userId,
    file: req.file!,
  };

  const result: Result<
    SuccessResponse<string>,
    ErrorResponse
  > = await uploadImage(data);

  if (!result.success) {
    res.status(result.error.statusCode).json({
      error: result.error.errorMessage,
    });

    return;
  }

  const id = result.data.data;

  res
    .status(result.data.statusCode)
    .set({
      "Cache-Control": "no-store,",
      Pragma: "no-cache",
      Expires: "0",
    })
    .setHeader("Access-Control-Expose-Headers", "Location")
    .location(`/imageUrl/${id}`)
    .json({
      message: result.data.message,
    });
};

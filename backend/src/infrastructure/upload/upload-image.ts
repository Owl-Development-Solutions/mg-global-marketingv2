import {
  ErrorResponse,
  Result,
  SuccessResponse,
  UploadImageData,
  User,
} from "../../utils";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { connection } from "../../config/mysql.db";
import { Multer } from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "us-west-004",
  endpoint: process.env.B2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export const uploadImage = async (
  data: UploadImageData,
): Promise<Result<SuccessResponse<string>, ErrorResponse>> => {
  try {
    const db = connection();

    if (!data.file) {
      return {
        success: false,
        error: {
          statusCode: 400,
          errorMessage: "File is required",
        },
      };
    }

    // 🔹 Get existing image key
    const [existingUsers] = await db.query(
      "SELECT image FROM users WHERE id = ?",
      [data.userId],
    );

    const user = (existingUsers as User[])[0];
    const oldKey = user?.image;

    // 🔹 Delete old image if exists
    if (oldKey) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.B2_BUCKET!,
          Key: oldKey,
        }),
      );
    }

    // 🔹 Create new file name (KEY only)
    const fileExtension = data.file.originalname.split(".").pop();
    const newFileName = `users/${uuidv4()}.${fileExtension}`;

    // 🔹 Upload to B2
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET!,
        Key: newFileName,
        Body: data.file.buffer,
        ContentType: data.file.mimetype,
      }),
    );

    // 🔹 Generate Signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET!,
      Key: newFileName,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60,
    });

    console.log("signedUrl", signedUrl);

    // 🔹 Save KEY in database
    await db.query("UPDATE users SET image = ? WHERE id = ?", [
      signedUrl,
      data.userId,
    ]);

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Image uploaded successfully",
        data: signedUrl,
      },
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: "Failed to upload image",
      },
    };
  }
};

import { Request, Response } from "express";
import { updateUserIn, UpdateUserData } from "../../infrastructure/users/update-user";
import path from "path";

export const updateUserController = async (req: Request, res: Response) => {
  try {
    console.log('=== UPDATE USER CONTROLLER DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('User from token:', (req as any).user);
    
    const { userId } = req.params;
    
    // Handle file upload
    let profileImagePath: string | undefined;
    if (req.file) {
      console.log('File uploaded:', req.file.filename);
      // For now, store the file path. In production, you might want to store
      // the file in a cloud storage and save the URL
      profileImagePath = req.file.filename;
    }

    const updateData: UpdateUserData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      profileImage: profileImagePath,
    };
    
    console.log('Update data prepared:', updateData);

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateUserData] === undefined) {
        delete updateData[key as keyof UpdateUserData];
      }
    });
    
    console.log('Final update data:', updateData);

    const result = await updateUserIn(userId as string, updateData);
    
    console.log('Update result:', result);

    if (result.success) {
      res.status(result.data.statusCode).json(result.data);
    } else {
      res.status(result.error.statusCode).json({
        message: result.error.errorMessage,
        statusCode: result.error.statusCode,
      });
    }
  } catch (error) {
    console.error("Update user controller error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

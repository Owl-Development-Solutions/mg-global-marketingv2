import { connection } from "../../config/mysql.db";
import {
  ErrorResponse,
  GeonologyNode,
  Result,
  SuccessResponse,
  User,
  UserStats,
} from "../../utils";
import { buildNodeTree } from "../../utils/helpers/genology-helper";

export const getGeonologyTreeIn = async (
  user: string
): Promise<Result<SuccessResponse<GeonologyNode>, ErrorResponse>> => {
  const db = connection();

  try {
    const [rootRows] = await db.execute(
      `SELECT
            u.id, u.userName, u.firstName, u.lastName,
            us.balance, us.leftPoints, us.rightPoints, us.leftDownline, us.rightDownline,
            us.rankPoints, us.level, us.sidePath, us.hasDeduction,
            u.leftChildId, u.rightChildId, 
            u.sponsorId, 
            s.firstName AS sponsorFirstName, 
            s.lastName AS sponsorLastName
        FROM users u
        JOIN user_stats us ON u.id = us.userId
        LEFT JOIN users s ON u.sponsorId = s.id
        WHERE u.id = ?`,
      [user]
    );

    const rootUsers = rootRows as any;

    const rootUser = rootUsers[0] as User &
      UserStats & { lefChild: string | null; rightChild: string | null };

    if (!rootUser) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "User not found",
        },
      };
    }

    const tree = await buildNodeTree(db, rootUser, 0, "root");

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Geonology tree successfully retrieved",
        data: tree,
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

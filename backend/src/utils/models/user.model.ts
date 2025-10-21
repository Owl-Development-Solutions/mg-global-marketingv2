import { RowDataPacket } from "mysql2";
import { connection } from "../../config/mysql.db";
import { User } from "./user";

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const db = connection();

  const [rows] = await db.query<User[] & RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

export const saveRefreshToken = async (userId: string, token: string) => {
  const db = connection();

  await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
    token,
    userId,
  ]);
};

export const getRefreshToken = async (
  userId: string
): Promise<User | undefined> => {
  const db = connection();
  const [rows] = await db.query<User & RowDataPacket[]>(
    "SELECT refresh_token FROM users WHERE id = ?",
    [userId]
  );

  return rows[0]?.refresh_token;
};

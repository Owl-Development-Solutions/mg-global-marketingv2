import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: mysql.Pool;

//change the object into this when switching to dev
// host: process.env.DB_HOST_NEW!,
// user: process.env.DB_USER_NEW!,
// password: process.env.DB_PASSWORD_NEW!,
// database: process.env.DB_DATABASE_NEW!,
// port: Number(process.env.DB_PORT_NEW),

export const connection = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      port: Number(process.env.DB_PORT),
      ssl: {
        rejectUnauthorized: false,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
};

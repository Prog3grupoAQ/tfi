import mysql from "mysql2/promise";

const { DB_HOST, DB_USER, DB_PASS, DB_DATABASE } = process.env;

export const Database = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

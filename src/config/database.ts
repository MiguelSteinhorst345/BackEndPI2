import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const pool = mysql.createPool({
// O Pool cria várias conexões, em vez de abrir uma conexão para cada consulta, ele reutiliza conexãoes já existentes
// as requisições abaixo vem do .env
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;
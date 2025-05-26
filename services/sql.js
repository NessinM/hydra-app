import sql from "mssql";
import config from "../config.js";

/**
 * Obtiene una conexión SQL usando async/await
 * @param {string} empresa - Clave para acceder a la configuración de conexión
 * @returns {Promise<sql.ConnectionPool>} - Devuelve una conexión abierta
 */
const driver_1 = async (empresa) => {
  try {
    const pool = await sql.connect(config[empresa].db.principal);
    return pool;
  } catch (err) {
    console.error("Error al conectar a la BD:", err);
    throw err;
  }
};

export default {
  driver_1,
};

import db from "../config/db.js";


export const findClienteByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT cliente_id, Nombre, Apellido, Telefono, Email, Contrasena FROM Cliente WHERE Email = ?",
    [email]
  );
  return rows;
};

export const findClienteById = async (id) => {
  const [rows] = await db.query(
    "SELECT cliente_id, Nombre, Apellido, Telefono, Email FROM Cliente WHERE cliente_id = ?",
    [id]
  );
  return rows;
};

export const findClientePasswordById = async (id) => {
  const [rows] = await db.query(
    "SELECT Contrasena FROM Cliente WHERE cliente_id = ?",
    [id]
  );
  return rows;
};

export const insertCliente = async (nombre, apellido, telefono, email, contrasenaHash) => {
  const [result] = await db.query(
    "INSERT INTO Cliente (Nombre, Apellido, Telefono, Email, Contrasena) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, telefono, email, contrasenaHash]
  );
  return result;
};

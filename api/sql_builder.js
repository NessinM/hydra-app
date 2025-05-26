import util from "../services/sql.js";
import sql from "mssql";

const DEFAULT_DRIVER = "driver_1";

function timeLog(type, label) {
  if (type === "start") {
    console.time(label);
  } else if (type === "end") {
    console.timeEnd(label);
  }
}

function addInputs(request, params) {
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }
}

async function insert(table, empresa, obj, driver = DEFAULT_DRIVER) {
  if (!obj || Object.keys(obj).length === 0) {
    console.warn("No inserta porque no mando nada: ", obj);
    return 0;
  }

  const fields = Object.keys(obj);
  const placeholders = fields.map((field) => `@${field}`);

  const query = `
    INSERT INTO ${table} (${fields.join(", ")})
    VALUES (${placeholders.join(", ")});
  `;

  const queryTime = `sql insert ${table} ${empresa}`;

  const con = await util[driver](empresa);
  try {
    const request = new sql.Request(con);
    addInputs(request, obj);

    timeLog("start", queryTime);
    await request.query(query);
    timeLog("end", queryTime);
    return 1;
  } finally {
    con.close();
  }
}

async function getOne(table, empresa, id, driver = DEFAULT_DRIVER) {
  const query = `SELECT * FROM ${table} WHERE id = @id`;
  const queryTime = `sql getOne ${table} ${empresa} ${id}`;

  const con = await util[driver](empresa);
  try {
    const request = new sql.Request(con);
    request.input("id", id);

    timeLog("start", queryTime);
    const result = await request.query(query);
    timeLog("end", queryTime);

    return result.recordset.length > 0 ? result.recordset[0] : null;
  } finally {
    con.close();
  }
}

async function update(table, empresa, key, obj, driver = DEFAULT_DRIVER) {
  if (!obj || Object.keys(obj).length === 0) return 0;

  const updates = Object.keys(obj)
    .map((field) => `${field} = @${field}`)
    .join(", ");
  const query = `
    UPDATE ${table}
    SET ${updates}
    WHERE id = @key;
  `;

  const queryTime = `sql update ${table} ${empresa} ${key}`;

  const con = await util[driver](empresa);
  try {
    const request = new sql.Request(con);
    addInputs(request, obj);
    request.input("key", key);

    timeLog("start", queryTime);
    await request.query(query);
    timeLog("end", queryTime);
    return 1;
  } finally {
    con.close();
  }
}

async function query(table, empresa, query, obj, driver = DEFAULT_DRIVER) {
  const queryTime = `sql query ${table} ${empresa}`;
  const con = await util[driver](empresa);

  try {
    const request = new sql.Request(con);
    addInputs(request, obj);

    timeLog("start", queryTime);
    const result = await request.query(query);
    timeLog("end", queryTime);

    return result.recordset;
  } finally {
    con.close();
  }
}

export default {
  insert,
  getOne,
  update,
  query,
};

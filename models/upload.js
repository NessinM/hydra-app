import sql from "../api/sql_builder.js";
import path from "path";
import fs from "fs";
import config from "../config.js";
import async from "async";
import moment from "moment";
import fsPromises from "fs/promises";

export const registrar = async (req, res) => {
  const { empresa, app, carpeta, usuario, numeroCarga } = req.query;
  const domain = config.apiRoute;

  const response = {
    status: 0,
    message: "",
  };

  if (!req.file) {
    response.message = "No se ha subido ningun archivo";
    return res.send(response);
  }

  try {
    const localPath = path
      .join("storage", app, empresa, carpeta)
      .replace(/\\/g, "/");
    const ruta = `${domain}/${localPath}/${req.file.filename}`;

    const obj = {
      app,
      usuario,
      ruta,
      archivo: req.file.originalname,
      archivoNuevo: req.file.filename,
      carpeta,
      empresa,
      peso: req.file.size,
      extension: path.extname(req.file.originalname),
      accion: "guardar nuevo archivo",
    };

    await sql.insert("auditoria_upload", "datacont", obj);

    // await insertarLogUniversal(empresa, usuario, 'Guardar nuevo archivo', numeroCarga);

    response.status = 1;
    response.ruta = obj.ruta;
    response.archivo = req.file.originalname;
    response.peso = req.file.size;
    response.filename = req.file.filename;
    response.extension = path.extname(req.file.originalname);
    response.mimetype = req.file.mimetype;
    response.file = obj;

    res.send(response);
  } catch (err) {
    console.error("Error:", err.message);
    response.message = err.message;
    res.send(response);
  }
};

// async function insertarLogUniversal(empresa, usuario, accion, numeroCarga) {
//   const objAuditoriaUniversal = {
//     accion,
//     procesoEmpresa: empresa,
//     modulo: 'carga_transportista',
//     numeroCarga
//   };

//   // Asegúrate de que `api.octo.auditoria_universal.insert` esté adaptado a Promises
//   return api.octo.auditoria_universal.insert(empresa, usuario, objAuditoriaUniversal);
// }

const processFiles = (files) => {
  global.storage_is_loading = true;
  async.eachSeries(
    files,
    (file, next) => {
      validarParametrosFile(file)
        .then(() => next())
        .catch((err) => next());
    },
    (err) => {
      if (err) console.log("Error al procesar documentos", err);
      else
        files.length &&
          console.log("Total de documentos procesados", files.length);
      global.storage_is_loading = false;
    }
  );
};

function createDirIfNotExists(dirPath = "") {
  if (!fs.existsSync(dirPath)) {
    var parentDir = path.dirname(dirPath);
    if (!fs.existsSync(parentDir)) {
      createDirIfNotExists(parentDir);
    }
    fs.mkdirSync(dirPath);
  }
  return dirPath;
}

const validarParametrosFile = async (file = "") => {
  try {
    const domain = config.apiRoute;
    const currentPath = path.join(process.cwd(), "storage_listener", file);
    var uploadDir = path.join(process.cwd(), "storage");
    const structure = file.split("#");
    if (structure.length < 4) {
      await writeLogError(
        file,
        "El archivo no tiene la estructura correcta: app#empresa#carpeta#nombre"
      );
      return;
    }
    const [app, empresa, carpeta, name] = file.split("#");

    if (!app) {
      await writeLogError(file, "El archivo no tiene el nombre de la app");
      return;
    }

    if (!empresa) {
      await writeLogError(file, "El archivo no tiene el nombre de la empresa");
      return;
    }

    if (!carpeta) {
      await writeLogError(file, "El archivo no tiene el nombre de la carpeta");
      return;
    }
    if (!name) {
      await writeLogError(file, "El archivo no tiene el nombre del archivo");
      return;
    }

    const appDir = path.join(uploadDir, app);
    const empresaDir = path.join(appDir, empresa);
    const repoDir = path.join(empresaDir, carpeta);
    const pathFileSinNombre = createDirIfNotExists(repoDir);
    const nombreSinExtension = name.substring(0, name.lastIndexOf(".")) || file;
    const extension = path.extname(name)
      ? path.extname(name).toLocaleLowerCase()
      : "";
    const fileName = `${nombreSinExtension}${extension}`;
    const pathFileConNombre = path.join(pathFileSinNombre, fileName);
    const fileStat = await fsPromises.stat(path.resolve(currentPath));

    await fsPromises.rename(currentPath, pathFileConNombre);
    const ruta = `${domain}/${app}/${empresa}/${carpeta}/${fileName}`;

    const obj = {
      app,
      usuario: "listener-hydra",
      ruta,
      archivo: file,
      archivoNuevo: fileName,
      carpeta,
      empresa,
      peso: fileStat.size,
      extension: extension,
      accion: "guardar nuevo archivo",
    };

    await sql.insert("auditoria_upload", "datacont", obj);
    // await insertarLogUniversal(empresa, usuario, 'Guardar nuevo archivo', numeroCarga);

    return fileName;
  } catch (error) {
    await writeLogError(file, error);
    throw error;
  }
};

const writeLogError = async (file, message) => {
  try {
    console.error("Error al procesar el archivo:", file, message);
    const destinationErrorDirectoryPath = path.join(
      process.cwd(),
      "storage",
      "errors"
    );
    const destinationErrorFilePath = path.join(
      process.cwd(),
      "storage",
      "errors",
      "log_storage_listener_errors.txt"
    );
    if (!fs.existsSync(destinationErrorDirectoryPath))
      fs.mkdirSync(destinationErrorDirectoryPath);
    if (!fs.existsSync(destinationErrorFilePath))
      await fsPromises.appendFile(
        destinationErrorFilePath,
        " Listado de errores al pasar por el listener"
      );
    let data = await fsPromises.readFile(destinationErrorFilePath, "utf-8");
    data = `${data} \n ${file}: ${message} - procesado el ${moment().format(
      "DD/MM/YYYY HH:mm"
    )}`;
    await fsPromises.writeFile(destinationErrorFilePath, data);
    await fsPromises.rename(
      path.join(process.cwd(), "storage_listener", file),
      `storage/errors/${file}`
    );
  } catch (error) {
    throw error;
  }
};

export default {
  registrar,
  processFiles,
};

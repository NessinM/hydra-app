import sql from '../api/sql_builder.js';
import path from 'path';
import config from '../config';
// import { promisify } from 'util';

// const insertarLogUniversalAsync = promisify(api.octo.auditoria_universal.insert);

export const registrar = async (req, res) => {
  const { empresa, app, carpeta, usuario, numeroCarga } = req.query;
  const domain = config.apiRoute;

  const response = {
    status: 0,
    message: ''
  };

  if (!req.file) {
    response.message = 'No se ha subido ningun archivo';
    return res.send(response);
  }

  try {
    const localPath = path.join('storage', app, empresa, carpeta).replace(/\\/g, '/');
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
      accion: 'guardar nuevo archivo',
    };

    await sql.insert('auditoria_upload', 'datacont', obj);

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
    console.error('Error:', err.message);
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


const validarParametrosFile = async (file = "") => {
  try {
    var uploadDir = path.join(process.cwd(), "storage");
    const currentPath = path.join(
      process.cwd(),
      "storage_listener",
      file
    );
    // "[sil]-[datacont]-[guias-firmadas_externo]-[archivo_ff.pdf]"
    const filename = file.substring(0, file.lastIndexOf(".")) || file;
    console.log('filename', filename)
    const extension = file.split(".").pop();
    console.log('extension', extension)
    const [ app, empresa, carpeta, name ] = filename.split("-");
    console.log('name', name)
    return filename

    // var destination = function (req, file, cb) {
    //   var appDir = path.join(uploadDir, app);
    //   var empresaDir = path.join(appDir, empresa);
    //   var repoDir = path.join(empresaDir, carpeta);

    //   try {
    //     createDirIfNotExists(repoDir);
    //     cb(null, repoDir);
    //   } catch (err) {
    //     console.error("Error creando directorios:", err);
    //     cb(err);
    //   }
    // }

    // var filename = function (req, file, cb) {
    //   var uid = Date.now();
    //   var fileName = req.query.nombre
    //     ? `${uid}-${req.query.nombre}${path.extname(file.originalname)}`
    //     : `${uid}-${file.originalname}`;

    //   req.filename = fileName;
    //   cb(null, fileName);
    // }

  } catch (error) {
    await writeLogError(file, error);
    throw error;
  }
};

const writeLogError = async (file, message) => {
  try {
    const destinationErrorDirectoryPath = path.join(
      process.cwd(),
      "storage_invoices",
      "errors"
    );
    const destinationErrorFilePath = path.join(
      process.cwd(),
      "storage_invoices",
      "errors",
      "log_invoices_listener_errors.txt"
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
      `storage_invoices/errors/${file}`
    );
  } catch (error) {
    throw error;
  }
};

export default {
  registrar,
  processFiles,
}
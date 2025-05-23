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
    const currentPath = path.join(
      process.cwd(),
      "storage_listener",
      file
    );
    const filename = file.substring(0, file.lastIndexOf(".")) || file;
    const extension = file.split(".").pop();
    const estructure_filename = filename.split("-");

    if (extension !== "pdf" && extension !== "xml") {
      await writeLogError(
        file,
        "La extencion del documento es diferente a PDF y a XML"
      );
    }

    if (estructure_filename.length < 4) {
      await writeLogError(file, "No cuenta con un nombre de archivo adecuado");
    } else if (
      !global.electronic_document_companies.filter(
        (e) => e.value === estructure_filename[0]
      ).length
    ) {
      await writeLogError(
        file,
        "El primer parametro del filename no es un RUC valido"
      );
    } else if (
      !global.electronic_document_types.filter(
        (e) => e.value === estructure_filename[1]
      ).length
    ) {
      await writeLogError(
        file,
        "El segundo parametro del filename no es un tipo de documento valido"
      );
    } else {
      const year = moment().format("YYYY");
      const empresa =
        global.electronic_document_companies.find(
          (e) => e.value === estructure_filename[0]
        )?.name || "";
      const typeInvoice =
        global.electronic_document_types.find(
          (e) => e.value === estructure_filename[1]
        )?.directory || "";
      const filenameYear = `${year}-${filename}`.split("-").join("");
      const pathInvoicePDFUpdate = `${process.env.API_CLIENT_ROUTE}/V01?file=INVP${filenameYear}`;
      const pathInvoiceXMLUpdate = `${process.env.API_CLIENT_ROUTE}/V01?file=INVX${filenameYear}`;
      const destinationYearDirectoryPath = path.join(
        process.cwd(),
        "storage_invoices",
        year
      );
      const destinationEmpresaDirectoryPath = path.join(
        process.cwd(),
        "storage_invoices",
        year,
        empresa
      );
      const destinationPDFDirectoryPath = path.join(
        process.cwd(),
        "storage_invoices",
        year,
        empresa,
        extension
      );
      const destinationInvoiceTypeDirectoryPath = path.join(
        process.cwd(),
        "storage_invoices",
        year,
        empresa,
        extension,
        typeInvoice
      );
      if (!fs.existsSync(destinationYearDirectoryPath))
        fs.mkdirSync(destinationYearDirectoryPath);
      if (!fs.existsSync(destinationEmpresaDirectoryPath))
        fs.mkdirSync(destinationEmpresaDirectoryPath);
      if (!fs.existsSync(destinationPDFDirectoryPath))
        fs.mkdirSync(destinationPDFDirectoryPath);
      if (!fs.existsSync(destinationInvoiceTypeDirectoryPath))
        fs.mkdirSync(destinationInvoiceTypeDirectoryPath);
      await api.updatePathInvoiceInSAP(
        empresa,
        estructure_filename[2],
        estructure_filename[3],
        estructure_filename[1],
        pathInvoicePDFUpdate,
        pathInvoiceXMLUpdate
      );
      await fsPromises.rename(
        currentPath,
        `${destinationInvoiceTypeDirectoryPath}/${file}`
      );
    }
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
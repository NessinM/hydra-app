import express from "express";
var router = express.Router();
import uploadModel from "../models/upload";
import path from "path";
import fs from "fs";
import multer from "multer";

function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    var parentDir = path.dirname(dirPath);
    if (!fs.existsSync(parentDir)) {
      createDirIfNotExists(parentDir);
    }
    fs.mkdirSync(dirPath);
  }
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = path.join(process.cwd(), "storage");
    var appDir = path.join(uploadDir, req.query.app);
    var empresaDir = path.join(appDir, req.query.empresa);
    var repoDir = path.join(empresaDir, req.query.carpeta);

    try {
      createDirIfNotExists(repoDir);
      cb(null, repoDir);
    } catch (err) {
      console.error("Error creando directorios:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    var uid = Date.now();
    var fileName = req.query.nombre
      ? `${uid}-${req.query.nombre}${path.extname(file.originalname)}`
      : `${uid}-${file.originalname}`;

    req.filename = fileName;
    cb(null, fileName);
  },
});

var upload = multer({ storage: storage });

router.post("/", upload.single("file"), uploadModel.registrar);

export default router;

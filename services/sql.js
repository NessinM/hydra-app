import sql from "mssql";
import config from "../util/config";

const driver_1 = function (empresa, callback) {
  var con = new sql.Connection(config[empresa].db.object_connection, function (
    err
  ) {
    if (err) {
      console.error("Error: ", err);
      con.close();
      callback(err);
      return;
    }

    callback(null, con);
  });
};

export  default {
  driver_1
}
var environment = process.env.NODE_ENV || "production";
var config = {
  production: {
    port: 5003,
    env: environment,
    apiRoute: "https://api-sil.datacont.com",
    datacont: {
      nombreFull: "Datacont S.A.C.",
      logo: "http://sil.datacont.com/static/logo.png",
      color: "#b80813",
      db: {
        object_connection: {
          user: "sa",
          password: "kofexi-85",
          server: "192.168.6.249",
          database: "datacont",
          port: 1433,
          options: {
            encrypt: false,
            useUTC: false,
          },
        },
      },
    },
    reprodata: {
      nombreFull: "Reprodata S.A.C.",
      logo: "https://sil.reprodata.com.pe/static/logo.png",
      color: "#e6007e",
      db: {
        object_connection: {
          user: "sa",
          password: "kofexi-85",
          server: "192.168.6.249",
          database: "reprodata",
          port: 1433,
          options: {
            encrypt: false,
            useUTC: false,
          },
        },
      },
    },
  },
  development: {
    port: 5003,
    env: environment,
    apiRoute: "https://api-sil.datacont.com",
    datacont: {
      nombreFull: "Datacont S.A.C.",
      logo: "http://sil.datacont.com/static/logo.png",
      color: "#b80813",
      db: {
        principal: {
          user: "sa",
          password: "kofexi-85",
          server: "192.168.6.249",
          database: "datacont",
          port: 1433,
          options: {
            encrypt: false,
            useUTC: false,
          },
        },
      },
    },
    reprodata: {
      nombreFull: "Reprodata S.A.C.",
      logo: "https://sil.reprodata.com.pe/static/logo.png",
      color: "#e6007e",
      db: {
        principal: {
          user: "sa",
          password: "kofexi-85",
          server: "192.168.6.249",
          database: "reprodata",
          port: 1433,
          options: {
            encrypt: false,
            useUTC: false,
          },
        },
      },
    },
  },
};

export default config[environment];

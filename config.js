var environment = process.env.NODE_ENV || "production";
var config = {
  production: {
    port: 9000,
    env: environment,
    apiRoute: "https://up-cloud.datacont.com/storage",
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
    }
  },
  development: {
    port: 8000,
    env: environment,
    apiRoute: `http://localhost:8000/storage`,
    datacont: {
      nombreFull: "Datacont S.A.C.",
      logo: "http://sil.datacont.com/static/logo.png",
      color: "#b80813",
      db: {
        principal: {
          user    : 'sa',
          password: 'sql',
          server  : '192.168.9.186',
          database: 'datacont',
          // port: 58282,
          options: {
              encrypt: false,
              useUTC : false
          }
        },
      },
    }
  },
};

export default config[environment];

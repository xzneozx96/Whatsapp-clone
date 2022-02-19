require("dotenv").config();

module.exports = {
  serverPort: process.env.SERVER_PORT,
  appDomain: process.env.APP_DOMAIN,
  dbURI: process.env.DB_URI,
};

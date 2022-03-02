require("dotenv").config();

module.exports = {
  serverPort: process.env.SERVER_PORT,
  localDomain: process.env.LOCAL_DOMAIN,
  deployedDomain: process.env.DEPLOYED_DOMAIN,
  dbURI: process.env.DB_URI,
};

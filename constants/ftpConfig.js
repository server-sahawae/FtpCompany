const ftp = require("basic-ftp");
const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: true,
};

module.exports = ftpConfig;

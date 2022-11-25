const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");
const { v4: v4uuid } = require("uuid");

const ftpConfig = require("../constants/ftpConfig");
const checkFileType = require("../constants/filetypes");

module.exports = class Controller {
  static async list(req, res, next) {
    const ftpClient = new ftp.Client(0);
    ftpClient.ftp.verbose = true;
    try {
      await ftpClient.access(ftpConfig);
      console.log("coba");
      const result = await ftpClient.list();
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error);
    } finally {
      ftpClient.close();
    }
  }

  static async getFile(req, res, next) {
    const ftpClient = new ftp.Client(0);
    ftpClient.ftp.verbose = true;
    try {
      const { fileName } = req.params;
      await ftpClient.access(ftpConfig);
      await ftpClient.downloadTo(
        path
          .join("files/", checkFileType(fileName), fileName)
          .replace(/\\/g, "/"),
        path.join(checkFileType(fileName), fileName).replace(/\\/g, "/")
      );
      res
        .status(200)
        .sendFile(
          path
            .join(__dirname, "../files/", checkFileType(fileName), fileName)
            .replace(/\\/g, "/"),
          (err) => {
            if (err) throw err;
            else
              fs.unlinkSync(
                `./files/${checkFileType(fileName)}/${fileName}`.replace(
                  /\\/g,
                  "/"
                )
              );
          }
        );
      console.log("load");
    } catch (error) {
      console.log(error);
      res.send(error);
    } finally {
      ftpClient.close();
    }
  }

  static async upload(req, res, next) {
    const ftpClient = new ftp.Client(0);
    ftpClient.ftp.verbose = true;

    try {
      const { name, data } = req.body;
      const fileName = v4uuid() + path.extname(name);
      fs.writeFileSync(`./files/${checkFileType(fileName)}/${fileName}`, data, {
        encoding: "base64",
      });
      await ftpClient.access({ ...ftpConfig });
      await ftpClient.uploadFrom(
        `./files/${checkFileType(fileName)}/${fileName}`,
        `${checkFileType(fileName)}/${fileName}`
      );
      ftpClient.close();
      res.send("data");
    } catch (error) {
      console.log(error);
      res.send(error);
    } finally {
      ftpClient.close();
    }
  }

  static async deleteFile(req, res, next) {
    const ftpClient = new ftp.Client(0);
    ftpClient.ftp.verbose = true;
    try {
      const { fileName } = req.params;

      await ftpClient.access(ftpConfig);
      await ftpClient.remove(
        path.join(checkFileType(fileName), fileName).replace(/\\/g, "/")
      );
      res.status(200).json({ message: `${fileName} has been deleted!` });
    } catch (error) {
      res.status(500).json(error);
    } finally {
      ftpClient.close();
    }
  }

  static async newCompany(req, res, next) {
    const ftpClient = new ftp.Client(0);
    ftpClient.ftp.verbose = true;
    try {
      // const { name } = req.body;
      const name = v4uuid();
      await ftpClient.access(ftpConfig);
      await ftpClient.send("mkd " + name);
      await ftpClient.send("mkd " + name + "/image");
      await ftpClient.send("mkd " + name + "/video");
      await ftpClient.send("mkd " + name + "/audio");
      await ftpClient.send("mkd " + name + "/document");

      res.status(200).json({ message: "Directories has been created!" });
    } catch (error) {
      console.log(error);
      res.status(error.code).json(error.message);
    } finally {
      ftpClient.close();
    }
  }

  static async test(req, res, next) {
    const ftpClient = new ftp.Client(0);
    ftpClient.ftp.verbose = true;
    try {
      // const { name } = req.body;
      const name = v4uuid();
      await ftpClient.access(ftpConfig);
      // await ftpClient.send("EPSV");
      await ftpClient.send("pasv");
      await ftpClient.send("MLSD /");
      // console.log(data);
      res.status(200).json("data");
    } catch (error) {
      console.log(error);
      res.status(error.code).json(error.message);
    } finally {
      ftpClient.close();
    }
  }
};

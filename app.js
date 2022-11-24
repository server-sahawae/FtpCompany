const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const Client = require("ftp");
const ftpConfig = require("./helper/ftpConfig");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const ftp = new Client();
    const ftpPath = "/";

    console.log("start");
    let data;
    ftp.connect(ftpConfig);

    ftp.on("ready", () => {
      console.log("on");
      ftp.list(ftpPath, (error, list) => {
        if (error) throw error;
        // list ? console.dir(list) : console.log(error);
        console.log("zzz");
        data = list;
        ftp.end();
        res.status(200).json(data);
      });
    });
    4;
  } catch (error) {
    return res.status(500).json(error);
  }
});

// app.get("/image", async (req, res) => {
//   try {
//     const data = new URL("sftp://srv150.niagahoster.com");
//     // data = { ...ftpConfig };
//     data.host = "srv150.niagahoster.com";
//     data.protocol = "sftp";
//     data.port = "21";
//     data.username = "staisayidsabiq@projectmehvish.com";
//     data.password = "indramayu2703";
//     data.pathname = "/test-upload.jpg";
//     console.log(data);
//     request({ url: data }, (err, resp, buffer) => {
//       if (!err && resp.statusCode === 200) {
//         res.set("Content-Type", "image/jpeg");
//         res.send(resp.body);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// });

app.get("/image", async (req, res) => {
  try {
    const ftp = new Client();
    const ftpPath = "/";

    ftp.connect(ftpConfig);
    ftp.on("ready", () => {
      console.log("on");

      ftp.get(`${ftpPath}test-upload.png`, (err, stream) => {
        if (err) throw err;
        console.log("masuk");
        stream.once("close", function () {
          ftp.end();
        });
        stream.pipe(fs.createWriteStream("cobaaaa2.png"));
        console.log("done");
        res.status(200).json("ok");
      });
      console.log("done");
    });
  } catch (error) {
    console.log("error");
    res.send(error);
  }
});

app.get("/end", (req, res) => {
  try {
    ftp.abort((err) => console.log(err, "abort"));
    ftp.end();
    console.log("end");
    res.send("end");
  } catch (error) {}
});

app.get("/status", (req, res) => {
  try {
    console.log("status");
    ftp.status((err, stat) => {
      if (err) res.send(err);
      console.log(stat);
      res.send(stat);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/coba", (req, res) => {
  res.send("coba");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

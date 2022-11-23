const request = require("request");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Client = require("ftp");
const ftpConfig = require("./helper/ftpConfig");
const ftp = new Client();
const ftpPath = "/";
ftp.connect({
  host: "srv150.niagahoster.com",
  port: 21,
  user: "staisayidsabiq@projectmehvish.com", // defaults to "anonymous"
  password: "indramayu2703", // defaults to "@anonymous"
  pasvTimeout: 20000,
  keepalive: 20000,
  secureOptions: { rejectUnauthorized: false },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    console.log("start");

    ftp.on("ready", () => {
      console.log("on");
      ftp.list(ftpPath, async (error, list) => {
        try {
          console.log("list");
          if (error) throw error;
          console.dir(list);
          res.status(200).json(list);
        } catch (error) {
          console.log(error);
          res.send(error);
        }
      });
    });
    // ftp.end();
  } catch (error) {
    res.send(error);
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
    console.log("ftp get");
  } catch (error) {
    console.log(error);
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
app.listen(port, () => {
  console.log(ftp);
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const Controller = require("./controller");
app.use(express.urlencoded({ extended: true, limit: 10485760 }));
app.use(express.json());

app.get("/", Controller.test);
app.get("/list", Controller.list);
app.post("/upload", Controller.upload);

app.get("/:fileName", Controller.getFile);
app.delete("/:fileName", Controller.deleteFile);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

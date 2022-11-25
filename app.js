if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const Controller = require("./controller");
app.use(express.urlencoded({ extended: true, limit: 10485760 }));
app.use(express.json());

app.get("/", Controller.test);
app.get("/list", Controller.list);
app.post("/new", Controller.newCompany);
app.post("/upload", Controller.upload);

app.get("/file/:fileName", Controller.getFile);
app.delete("/file/:fileName", Controller.deleteFile);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

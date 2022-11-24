const path = require("path");

function checkFileType(fileName) {
  const fileExt = path.extname(fileName);
  switch (fileExt.toLowerCase()) {
    case ".jpg":
    case ".gif":
    case ".bmp":
    case ".png":
      return "image";
    case ".m4v":
    case ".avi":
    case ".mpg":
    case ".mp4":
      return "video";

    default:
      return false;
  }
}

module.exports = checkFileType;

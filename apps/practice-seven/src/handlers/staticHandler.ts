
const fs = require("fs");
const path = require("path");

const IMG_TYPES: string[] = ["jpg", "png", "webp", "gif", "jpeg"];
const MIME_TYPES: object = {
  "jpg": "image/jpeg",
  "png": "image/png",
  "gif": "image/gif",
  "jpeg": "image/jpeg",
  "webp": "image-webp",
};

const handleStaticFiles = (req, res) => {

  if (req.url.includes("/images"))
  {
    const extension = path.extname(req.url).toLowerCase().replace(".", "");

    if(!IMG_TYPES.includes(extension)) {
      throw new Error(`${extension} is not a valid image type.`);
    }

    const imagePath = path.join(__dirname, "../..", req.url);
    handleFileLoad(imagePath, res, extension);
  }
  else if (req.url.includes("/ts") && req.url.includes(".ts"))
  {
    const tsFilePath = path.join(__dirname, "../..", req.url);
    console.log(tsFilePath);
    handleFileLoad(tsFilePath, res, ".ts");
  }
  else if (req.url.includes("/css") && req.url.includes(".css"))
  {
    const cssFilePath = path.join(__dirname, "../..", req.url);
    console.log(cssFilePath);
    handleFileLoad(cssFilePath, res, ".css");
  }
  else
  {
    throw new Error("You don't have permission to load from this folder");
  }

}

const handleFileLoad = (path, res, extension = "") => {
  fs.readFile(path, extension === "" ? "utf8" : "", (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }

    let contentType = "";
    if (path.endsWith(".ts") || path.endsWith(".css")) {
      contentType = path.endsWith(".ts") ? "application/javascript" : "text/css"
    } else {
      if (extension !== "") {
        extension = MIME_TYPES[extension];
      }
    }

    if (contentType === null) {
      throw new Error(`${extension} is not a valid content type.`);
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

module.exports = { handleStaticFiles };
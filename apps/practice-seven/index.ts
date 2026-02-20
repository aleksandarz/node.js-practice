
const http = require("http");
const { handleStaticFiles } = require("./src/handlers/staticHandler");
const { handleAPICall } = require("./src/handlers/apiHandler");

const server = http.createServer((req: any, res: any) => {

  if (req.url.startsWith("/public/")) {
    handleStaticFiles(req, res);
    return;
  } else if (req.url.startsWith("/api/")) {
    handleAPICall(req, res);
    return;
  }

  if (req.url === "/") {
    console.log("Homepage");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 - Not Found");
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");

});

server.listen(3000, () => console.log("Server started on port http://localhost:3000"));

const logUserVisit = require("./src/logger")
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

  if (req.url.startsWith("/public/ts/") && req.url.endsWith(".ts")) {
    const filePath = path.join(__dirname, req.url);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not Found");
      }

      res.writeHead(200, { "Content-Type": "application/javascript" });
      return res.end(data);
    });

    return;
  }

  if (req.url.startsWith("/api/products")) {

    const jsonPath = path.join(__dirname, "data", "products.json");
    console.log(jsonPath);

    fs.readFile(jsonPath, "utf8", (err, jsonResponse) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not Found");
      }

      const response = JSON.parse(jsonResponse).filter(item => item.available === true);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(response));
    });

    return;
  }

  const filePath = path.join(__dirname, "public", "index.html");
  const navPath = path.join(__dirname, "html", "navigation.html");
  const footerPath = path.join(__dirname, "html", "footer.html");

  fs.readFile(filePath, "utf8", async (err, data) => {

    const nav = fs.readFileSync(navPath, "utf8");
    const footer = fs.readFileSync(footerPath, "utf8");

    if (err) {
      res.writeHead(500, { "Content-Type": "text/html" });
      return res.end("Server Error");
    }

    const variables = {
      name: "Lola",
      weight: 64,
      height: 178
    }

    let result = data
      .replace("{{ name }}", variables.name)
      .replace("{{ weight }}", variables.weight)
      .replace("{{ height }}", variables.height);

    result = result.replace("{{ navigation }}", nav);
    result = result.replace("{{ footer }}", footer);

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await logUserVisit(ip);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(result);

  });

});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

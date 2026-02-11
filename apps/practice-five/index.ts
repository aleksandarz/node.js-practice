
const logUserVisit = require("./src/logger")
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

  const filePath = path.join(__dirname, "index.html");
  const navPath = path.join(__dirname, "navigation.html");

  fs.readFile(filePath, "utf8", async (err, data) => {

    const nav = fs.readFileSync(navPath, "utf8");

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

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await logUserVisit(ip);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(result);

  });

});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

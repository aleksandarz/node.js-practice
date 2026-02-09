
const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "users.json");

const server = http.createServer((req, res) => {

  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    if (!data.email || !data.password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      const jsonResponse = JSON.stringify({ success: false, message: "Missing email or password" });
      res.end(jsonResponse);
      return;
    }

    console.log(data.email);
    console.log(data.password);

    let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    users.push(data);

    fs.writeFileSync(filePath, JSON.stringify(users));

    res.writeHead(200, { "Content-Type": "application/json" });
    const jsonSuccessResponse = JSON.stringify({ success: true, message: "User was added successfully" });
    res.end(jsonSuccessResponse);
  });

});

server.listen(3000);
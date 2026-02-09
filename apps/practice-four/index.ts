
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

    let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    let userExists = false;

    users.forEach(user => {
      if (user.email === data.email) {
        userExists = true;
      }
    });

    if (userExists) {
      res.writeHead(409, { "Content-Type": "application/json" });
      const jsonExistsResponse = JSON.stringify({ success: false, message: "User already exists" });
      res.end(jsonExistsResponse);
      return;
    }

    users.push(data);

    fs.writeFileSync(filePath, JSON.stringify(users));

    res.writeHead(200, { "Content-Type": "application/json" });
    const jsonSuccessResponse = JSON.stringify({ success: true, message: "User was added successfully" });
    res.end(jsonSuccessResponse);
  });

});

server.listen(3000);
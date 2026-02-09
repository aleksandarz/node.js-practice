
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

    if (data.email.trim() === "" || !data.email.includes("@")) {
      res.writeHead(400, { "Content-Type": "application/json" });
      const emailJsonResponse = JSON.stringify({ success: false, message: "Invalid email" });
      res.end(emailJsonResponse);
      return;
    }

    if (data.password.length < 6) {
      res.writeHead(400, { "Content-Type": "application/json" });
      const passwordJsonResponse = JSON.stringify({ success: false, message: "Password is to short" });
      res.end(passwordJsonResponse);
      return;
    }

    let users = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      users = fileContent.trim() ? JSON.parse(fileContent) : [];
    }

    let userExists = users.some((user) => user.email.toLowerCase() === data.email.toLowerCase());
    if (userExists) {
      res.writeHead(409, { "Content-Type": "application/json" });
      const jsonExistsResponse = JSON.stringify({ success: false, message: "User already exists" });
      res.end(jsonExistsResponse);
      return;
    }

    const createdAt = new Date().toISOString();
    users.push({
      email: data.email,
      password: data.password,
      createdAt: createdAt,
    });

    fs.writeFileSync(filePath, JSON.stringify(users));

    res.writeHead(200, { "Content-Type": "application/json" });
    const jsonSuccessResponse = JSON.stringify({
      success: true,
      message: "User was added successfully",
      user: {
        email: data.email,
        createdAt: createdAt,
      }
    });
    res.end(jsonSuccessResponse);
  });

});

server.listen(3000);
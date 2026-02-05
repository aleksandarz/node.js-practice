
const http = require("http");

const server = http.createServer((req: any, res: any) => {
  res.setHeader("Content-Type", "text/plain");

  const data: string[] = ["Aleksandar", "Mina", "Lola", "Vlada"];

  console.log(req.method);

  if (req.method === "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  switch (req.url) {
    case "/":
      res.statusCode = 200;
      res.end("Welcome to the main page");
      break;
    case "/about":
      res.statusCode = 200;
      res.end("Welcome to the about page");
      break;
    case "/contact":
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
      break;
    case "/api/users":
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      break;
    case "/redirect-me":
      res.statusCode = 301;
      res.setHeader("Location", "/about");
      res.end();
      break;
    default:
      res.statusCode = 404;
      res.end("Not Found");
      break;
  }

});

server.listen(3000);
console.log("Server is running at localhost - http://localhost:3000");
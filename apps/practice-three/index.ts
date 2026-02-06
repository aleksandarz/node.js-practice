

const http = require("http");

type NewsType = {
  title: string;
  description: string;
  createdAt: string;
}

const news: NewsType[] = require("./news.json");


const server = http.createServer((req: any, res: any) => {
  res.setHeader("Content-Type", "text/plain");

  const myUrl = new URL(req.url, "http://localhost:3000")
  console.log(myUrl);

  if (myUrl.pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    let articles = "";
    news.forEach((item: any) => {
      articles += `<p>${item.title}</p>`;
    });

    res.end("Welcome to the main page \n" + articles);
  }
  else if (myUrl.pathname === "/contact") {
    res.statusCode = 302;
    res.setHeader("Location", "/")
    res.end();
  }
  else if (myUrl.pathname === "/news") {
    const title = myUrl.searchParams.get("title");
    const foundArticle = news.find(article => article.title === title);

    if (foundArticle) {
      res.statusCode = 200;
      res.end("Welcome to the news page");
    } else {
      res.statusCode = 404;
      res.end("Article Not Found");
    }
  }
  else {
    res.statusCode = 404;
    res.end("Page Not Found");
  }

});

server.listen(3000);
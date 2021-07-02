const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");

    res.write("<html>");
    res.write("<head><title>HELLO!</title></head>");
    res.write("<body><h1>Hellooooooo 👋</h1></body>");

    //Add form
    res.write(
      '<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>'
    );

    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");

    res.write("<html>");
    res.write("<head><title>HElLO!</title></head>");
    res.write(
      "<body><ul><li><User12></User12></li> <li>User2</li></ul></body>"
    );

    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(message);
      res.setHeader("Content-Type", "text/html");

      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  return res.end();
});

server.listen(3333);

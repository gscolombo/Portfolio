const http = require("http");
const config = require("./config");
const fileHandler = require("./fileHandler");
const handleDBRequest = require("./db");

module.exports = server = http.createServer();

// Configure request event listener for server
server.on("request", async (req, res) => {
  // Parse URL and get resource
  const uri = new URL(req.url, `http://${req.headers.host}`);
  const resource = uri.pathname;

  // If it applies, process database requests
  if (resource.includes("db")) {
    const dbResponse = await handleDBRequest(req, uri);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(dbResponse));
  }

  // Set filename
  const filename =
    resource === "/" || !resource.includes(".")
      ? config.defaultIndex
      : resource;

  // Get resource file type
  const extension = filename.substring(filename.lastIndexOf(".") + 1);

  // Set resource folder
  const referer = req.headers.referer;
  const folder = referer
    ? referer.substring(referer.lastIndexOf("/"))
    : resource;

  // Set resource full path
  const fullPath = config.rootFolder + folder + filename;

  // Define a function to handle file reading and serving
  fileHandler(
    fullPath,
    (data) => {
      res.writeHead(200, {
        "Content-Type": config.types[extension] || "text/plain",
        "Content-Length": data.length,
      });
      res.end(data);
    },
    (err) => {
      res.writeHead(404);
      res.end();
    }
  );
});

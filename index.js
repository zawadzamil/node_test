// Dependencies
const http = require("http");
const url = require("url");
const qs = require("querystring");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const jsonfile = require("jsonfile");

// App Module Scafolding
const app = {};

//Configaration
app.config = {
  port: 3000,
};

//create server
app.createServer = () => {
  const server = http.createServer(app.handelReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening to Port ${app.config.port}` + ` With Pleasure!`);
  });
};

// Handel Req
app.handelReqRes = (req, res) => {
  //response handel
  const parseedUrl = url.parse(req.url, true);
  const path = parseedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  //   const decoder = new StringDecoder('utf-8')

  if (method == "post" && trimedPath == "file") {
    let body = "";
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err);
      } else if (err) {
        console.log(err);
      }
      fs.rename(req.file.path, "uploads/" + req.file.originalname, () => {
        if (err) {
          console.log(err);
        }
      });
      //
      jsonfile.readFile("./formData.json", (err, obj) => {
        if (err) {
            if (err.code === "ENOENT") {
                console.log("File not found!");
            } else if (err instanceof SyntaxError) {
                console.log("File is empty or not in JSON format");
            } else {
                console.error(err);
            }
            obj = {};
        }
        const filepath = "uploads/" + req.file.originalname;
        obj.push({ name: req.body.name, phone: req.body.phone,filepath });
        jsonfile.writeFile("./formData.json", obj, (err) => {
            if (err) console.error(err);
        });
    });
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "File uploaded!" }));
    });
  } else {
    res.end("Hello, You Aacessing /" + trimedPath);
  }
};

//Start Server
app.createServer();

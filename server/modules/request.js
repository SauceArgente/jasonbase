const codes = require("./http-codes");
const { cwd } = require("process");
const query = require("./query");
const jetpack  = require("fs-jetpack")

class request {
  constructor(req, res, type) {
    this.type = type;
    this.req = req;
    this.res = res;
    this.path = cwd() + "/db" + req.body.path;
    this.body = this.req.body;
  }

  setPrivileges(data) {
    this.privileges = data;
  }

  getPrivileges() {
    return this.privileges;
  }

  hasPrivilege(name){
    return name in this.privileges;
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      console.log(this.path);

      switch (this.body.type) {
        case "document":
          fs.readFile(this.path, "utf8", (err, data) => {
            if (!err) {
              resolve(data);
            } else {
              reject(404);
            }
          });
          break;
        case "query":
          query
            .executeQuery({ query: this.body.query, path: this.path })
            .then((data) => {
              resolve(data);
            });
          break;
      }
    });
  }

  switchByType({write,read}){
    console.log(this.type)
    switch(this.type){
      case "get":
        read()
        break;
      case "write":
        write()
        break;
    }
  }

  write() {
    jetpack.writeAsync(path, JSON.stringify(req.body.data)).then(() => {
      res.json(JSON.stringify(this.body.data));
    });
  }

  json(data) {
    this.jsonData = JSON.stringify(data);
  }

  validate() {
    this.res.status(200);
    this.res.json(this.jsonData);
  }

  reject(code) {
    this.res.status(code);
    let codeS = code.toString();
    console.log(codes[codeS]);
    this.res.json(JSON.stringify(codes[codeS]));
  }
}

module.exports = {
  DBrequest: request,
};
var path = require("path");
var express = require("express");
var morgan = require("morgan");
var onFinished = require("on-finished");
var bodyParser = require("body-parser");
var argvs = process.argv.splice(2);
var PORT = process.env.PORT || argvs[0] || 4000;

var NotFoundError = require("./lib/NotFoundError.js");

//=================连接数据库=========================
// 如不需要连接数据可可删除此段代码
// var mongoose = require("mongoose");
// var MONGODB_URI = process.env.MONGODB_URI || argvs[1];
// var optMongoose = {
//   useMongoCLient: true
// };
/*if (MONGODB_URI) {
 mongoose.connect(MONGODB_URI, optMongoose);
 mongoose.connection.on("error", function (err) {
 console.error("Mongoose connection error: %s", err.stack);
 });
 mongoose.connection.on("open", function () {
 console.log("Mongoose connected.");
 });
 mongoose.Promise = global.Promise;
 } else {
 console.error("Not set MONGODB_URI, MongoDB did not connect.");
 }*/
//===================================================

var app = express();
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./app")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  if (req.method === "OPTIONS") {
    res.send(200); //让options请求快速返回
  } else {
    next();
  }
});
app.use(function (req, res, next) {
  onFinished(res, function () {
    console.log("[%s] finished request", req.connection.remoteAddress);
  });
  next();
});

//=======================此处引入自己的路由文件======================
app.use(require("./routers/user.js")());
app.use(require("./routers/resource.js")());
app.use(require("./routers/operating.js")());
//=================================================================

app.use("*", function (req, res, next) {
  next(new NotFoundError("404"));
});
// 错误处理中间件 （所有错误应在此处理 而不是在其他中间件中处理）
app.use(function (err, req, res) {
  var code = 500;
  var msg = err.stack || {
    message: "Internal Server Error 1"
  };
  switch (err.name) {
    case "NotFoundError":
      code = err.status;
      msg = err.inner;
      break;
    default:
      break;
  }
  return res.status(code).json(msg);
});
require("http")
  .createServer(app)
  .listen(PORT, function () {
    console.log(
      "HTTP Server listening on port: %s, in %s mode",
      PORT,
      app.get("env")
    );
  });
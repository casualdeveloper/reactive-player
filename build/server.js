/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(1);
	
	var _express = __webpack_require__(2);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _http = __webpack_require__(3);
	
	var _http2 = _interopRequireDefault(_http);
	
	var _socket = __webpack_require__(4);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	var _chalk = __webpack_require__(5);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var isDevelopment = process.env.NODE_ENV !== "production";
	
	//----------------------------
	// Setup
	
	var app = (0, _express2.default)();
	var server = new _http2.default.Server(app);
	var io = (0, _socket2.default)(server);
	
	//----------------------------
	// Client Webpack
	
	if (process.env.USE_WEBPACK === "true") {
	    var webpackMiddleware = __webpack_require__(6),
	        webpackHotMiddleware = __webpack_require__(11),
	        webpack = __webpack_require__(7),
	        clientConfig = __webpack_require__(8);
	
	    var compiler = webpack(clientConfig);
	
	    app.use(webpackMiddleware(compiler, {
	        publicPath: "/build/",
	        stats: {
	            colors: true,
	            chunks: false,
	            assets: false,
	            timing: false,
	            modules: false,
	            hash: false,
	            version: false
	        }
	    }));
	
	    app.use(webpackHotMiddleware(compiler));
	
	    console.log(_chalk2.default.bgRed("Using webpack dev middleware - use only for DEV!"));
	}
	
	//----------------------------
	// Configure express
	
	app.set("view engine", "jade");
	app.set(_express2.default.static("public"));
	
	var useExternalStyle = !isDevelopment;
	app.get("/", function (req, res) {
	    res.render("index", {
	        useExternalStyle: useExternalStyle
	    });
	});
	
	//----------------------------
	// Modules
	
	//----------------------------
	// Socket
	
	io.on("connection", function (socket) {
	    console.log("Got connection from " + socket.request.connection.remoteAddress);
	});
	
	//----------------------------
	// Startup
	
	var port = process.env.PORT || 8080;
	function startServer() {
	    server.listen(port, function () {
	        console.log("Server started on " + port + " port");
	    });
	}
	startServer();

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("source-map-support/register");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("webpack-dev-middleware");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var path = __webpack_require__(9),
	    webpack = __webpack_require__(7),
	    extractTextPlugin = __webpack_require__(10);
	
	var dirname = path.resolve("./");
	
	var vendorModules = ["jquery"];
	
	function createConfig(isDebug) {
	    var devTool = isDebug ? "eval-source-map" : "source-map";
	    var plugins = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")];
	
	    var cssLoader = { test: /\.css$/, loader: "style!css" };
	    var sassLoader = { test: /\.scss/, loader: "style!css!sass" };
	    var appEntry = ["./src/client/application.js"];
	
	    if (!isDebug) {
	        plugins.push(new webpack.optimize.UglifyJsPlugin());
	        plugins.push(new extractTextPlugin("[name].css"));
	
	        cssLoader.loader = extractTextPlugin.extract("style", "css");
	        sassLoader.loader = extractTextPlugin.extract("style", "css!sass");
	    } else {
	        plugins.push(new webpack.HotModuleReplacementPlugin());
	        appEntry.splice(0, 0, "webpack-hot-middleware/client");
	    }
	
	    return {
	        devtool: devTool,
	        entry: {
	            application: appEntry,
	            vendor: vendorModules
	        },
	        output: {
	            path: path.join(dirname, "public", "build"),
	            filename: "[name].js",
	            publicPath: "/build/"
	        },
	        resolve: {
	            alias: {
	                shared: path.join(dirname, "src", "shared")
	            }
	        },
	        module: {
	            loaders: [{ test: /\.js$/, loader: "babel", exlude: /node_modules/ }, { test: /\.js$/, loader: "eslint", exlude: /node_modules/ }, { test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader: "url-loader?limit=1024" }, cssLoader, sassLoader]
	        },
	        plugins: plugins
	    };
	}
	
	module.exports = createConfig(true);
	module.exports.create = createConfig;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("extract-text-webpack-plugin");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = webpackHotMiddleware;
	
	var helpers = __webpack_require__(12);
	var pathMatch = helpers.pathMatch;
	
	function webpackHotMiddleware(compiler, opts) {
	  opts = opts || {};
	  opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
	  opts.path = opts.path || '/__webpack_hmr';
	  opts.heartbeat = opts.heartbeat || 10 * 1000;
	
	  var eventStream = createEventStream(opts.heartbeat);
	  var latestStats = null;
	
	  compiler.plugin("compile", function() {
	    latestStats = null;
	    if (opts.log) opts.log("webpack building...");
	    eventStream.publish({action: "building"});
	  });
	  compiler.plugin("done", function(statsResult) {
	    // Keep hold of latest stats so they can be propagated to new clients
	    latestStats = statsResult;
	    publishStats("built", latestStats, eventStream, opts.log);
	  });
	  var middleware = function(req, res, next) {
	    if (!pathMatch(req.url, opts.path)) return next();
	    eventStream.handler(req, res);
	    if (latestStats) {
	      // Explicitly not passing in `log` fn as we don't want to log again on
	      // the server
	      publishStats("sync", latestStats, eventStream);
	    }
	  };
	  middleware.publish = eventStream.publish;
	  return middleware;
	}
	
	function createEventStream(heartbeat) {
	  var clientId = 0;
	  var clients = {};
	  function everyClient(fn) {
	    Object.keys(clients).forEach(function(id) {
	      fn(clients[id]);
	    });
	  }
	  setInterval(function heartbeatTick() {
	    everyClient(function(client) {
	      client.write("data: \uD83D\uDC93\n\n");
	    });
	  }, heartbeat).unref();
	  return {
	    handler: function(req, res) {
	      req.socket.setKeepAlive(true);
	      res.writeHead(200, {
	        'Access-Control-Allow-Origin': '*',
	        'Content-Type': 'text/event-stream;charset=utf-8',
	        'Cache-Control': 'no-cache, no-transform',
	        'Connection': 'keep-alive'
	      });
	      res.write('\n');
	      var id = clientId++;
	      clients[id] = res;
	      req.on("close", function(){
	        delete clients[id];
	      });
	    },
	    publish: function(payload) {
	      everyClient(function(client) {
	        client.write("data: " + JSON.stringify(payload) + "\n\n");
	      });
	    }
	  };
	}
	
	function publishStats(action, statsResult, eventStream, log) {
	  // For multi-compiler, stats will be an object with a 'children' array of stats
	  var bundles = extractBundles(statsResult.toJson({ errorDetails: false }));
	  bundles.forEach(function(stats) {
	    if (log) {
	      log("webpack built " + (stats.name ? stats.name + " " : "") +
	        stats.hash + " in " + stats.time + "ms");
	    }
	    eventStream.publish({
	      name: stats.name,
	      action: action,
	      time: stats.time,
	      hash: stats.hash,
	      warnings: stats.warnings || [],
	      errors: stats.errors || [],
	      modules: buildModuleMap(stats.modules)
	    });
	  });
	}
	
	function extractBundles(stats) {
	  // Stats has modules, single bundle
	  if (stats.modules) return [stats];
	
	  // Stats has children, multiple bundles
	  if (stats.children && stats.children.length) return stats.children;
	
	  // Not sure, assume single
	  return [stats];
	}
	
	function buildModuleMap(modules) {
	  var map = {};
	  modules.forEach(function(module) {
	    map[module.id] = module.name;
	  });
	  return map;
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	exports.pathMatch = pathMatch;
	
	function pathMatch(url, path) {
	  if (url == path) return true;
	  var q = url.indexOf('?');
	  if (q == -1) return false;
	  return url.substring(0, q) == path;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map
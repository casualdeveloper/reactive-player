import "source-map-support/register";

import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";

const isDevelopment = process.env.NODE_ENV !== "production";

//----------------------------
// Setup

const app = express();
const server = new http.Server(app);
const io = socketIo(server);


//----------------------------
// Client Webpack

if(process.env.USE_WEBPACK === "true"){
    var webpackMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleware = require("webpack-hot-middleware"),
    webpack = require("webpack"),
    clientConfig=require("../../webpack.client");
    
    const compiler = webpack(clientConfig);
    
    app.use(webpackMiddleware(compiler,{
        publicPath: "/build/",
        stats:{
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
    
    console.log(chalk.bgRed("Using webpack dev middleware - use only for DEV!"));
}

//----------------------------
// Configure express

app.set("view engine","jade");
app.set(express.static("public"));

const useExternalStyle = !isDevelopment;
app.get("/",(req,res)=>{
    res.render("index",{
        useExternalStyle
    });
});

//----------------------------
// Modules

//----------------------------
// Socket

io.on("connection", socket=>{
    console.log(`Got connection from ${socket.request.connection.remoteAddress}`); 
});

//----------------------------
// Startup

const port = process.env.PORT || 8080;
function startServer(){
    server.listen(port,()=>{
       console.log(`Server started on ${port} port`); 
    });
}
startServer();
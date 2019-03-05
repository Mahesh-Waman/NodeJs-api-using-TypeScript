"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const logger_1 = require("./src/logger");
const routes_1 = require("./src/routes");
class App {
    constructor() {
        this.mongoUrl = 'mongodb://localhost/CRMdb';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.express = express();
            this.httpServer = http.createServer(this.express);
            this.middleware();
            this.setupRoutes();
            this.mongoSetup();
            logger_1.logger.warn('logger called from app');
        });
    }
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }
    setupRoutes() {
        routes_1.registerRoutes(this.express);
    }
    mongoSetup() {
        mongoose.connect(this.mongoUrl);
    }
}
exports.App = App;

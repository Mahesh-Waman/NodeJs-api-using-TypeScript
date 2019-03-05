"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./modules/user/user.controller");
function registerRoutes(app) {
    new user_controller_1.UserApi().register(app);
}
exports.registerRoutes = registerRoutes;

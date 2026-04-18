"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const route = (0, express_1.Router)();
route.post('/login', AuthController_1.AuthController.login);
route.get('/refresh', AuthController_1.AuthController.refreshToken);
route.post('/reset-password', AuthController_1.AuthController.resetPassword);
exports.default = route;
//# sourceMappingURL=AuthRoute.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const codeError_1 = require("../enums/codeError");
const formateReponse_1 = require("./formateReponse");
const roleMiddleware = (rolesAutorises) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole) {
            return formateReponse_1.FormaterResponse.failed(res, "Role non trouvé", codeError_1.HttpCode.NO_CONTENT);
        }
        if (!rolesAutorises.includes(userRole)) {
            return formateReponse_1.FormaterResponse.failed(res, "Accès refusé", codeError_1.HttpCode.FORBIDDEN);
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=roleMiddlewares.js.map
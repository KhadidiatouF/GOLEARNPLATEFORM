"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormaterResponse = void 0;
class FormaterResponse {
    static success(res, data, message, status) {
        return res.status(status).json({
            success: true,
            message,
            data
        });
    }
    static failed(res, message, status) {
        return res.status(status).json({
            success: false,
            message,
            data: []
        });
    }
}
exports.FormaterResponse = FormaterResponse;
//# sourceMappingURL=formateReponse.js.map
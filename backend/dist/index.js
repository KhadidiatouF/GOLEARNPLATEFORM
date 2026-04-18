"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const UtilisateurRoute_1 = __importDefault(require("./routes/UtilisateurRoute"));
const ProfesseurRoute_1 = __importDefault(require("./routes/ProfesseurRoute"));
const ApprenantRoute_1 = __importDefault(require("./routes/ApprenantRoute"));
const AdministrateurRoute_1 = __importDefault(require("./routes/AdministrateurRoute"));
const FormationRoute_1 = __importDefault(require("./routes/FormationRoute"));
const SessionRoute_1 = __importDefault(require("./routes/SessionRoute"));
const PaiementRoute_1 = __importDefault(require("./routes/PaiementRoute"));
const CertificationRoute_1 = __importDefault(require("./routes/CertificationRoute"));
const QuizRoute_1 = __importDefault(require("./routes/QuizRoute"));
const QuestionRoute_1 = __importDefault(require("./routes/QuestionRoute"));
const ReponseRoute_1 = __importDefault(require("./routes/ReponseRoute"));
const ProgressionRoute_1 = __importDefault(require("./routes/ProgressionRoute"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 4004;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
app.use(express_1.default.json());
// Swagger - Configuration complète avec options pour tester les endpoints
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default, {
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .auth-wrapper { display: flex; justify-content: flex-end; }
    .swagger-ui .auth-wrapper .authorize {
      background-color: #4CAF50;
      color: white;
      border: 1px solid #4CAF50;
    }
  `,
    customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.x.x/swagger-ui.css",
    customSiteTitle: "API Formation - Swagger",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "list",
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        supportedSubmitMethods: ["get", "put", "post", "delete", "patch", "delete"],
        authAction: {
            bearerAuth: {
                name: "bearerAuth",
                schema: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
                value: ""
            }
        }
    }
}));
app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger_json_1.default);
});
app.use("/auth", AuthRoute_1.default);
app.use("/users", UtilisateurRoute_1.default);
app.use("/profs", ProfesseurRoute_1.default);
app.use("/apprenants", ApprenantRoute_1.default);
app.use("/admin", AdministrateurRoute_1.default);
app.use("/formations", FormationRoute_1.default);
app.use("/sessions", SessionRoute_1.default);
app.use("/paiements", PaiementRoute_1.default);
app.use("/certifications", CertificationRoute_1.default);
app.use("/quiz", QuizRoute_1.default);
app.use("/questions", QuestionRoute_1.default);
app.use("/reponses", ReponseRoute_1.default);
app.use("/progressions", ProgressionRoute_1.default);
app.listen(port, () => {
    console.log(`Le serveur est en marche au http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
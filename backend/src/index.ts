import  express  from "express";
import AuthRoute from "./routes/AuthRoute";
import UtilisateurRoute from "./routes/UtilisateurRoute";
import ProfesseurRoute from "./routes/ProfesseurRoute";
import ApprenantRoute from "./routes/ApprenantRoute";
import AdministrateurRoute from "./routes/AdministrateurRoute";
import FormationRoute from "./routes/FormationRoute";
import SessionRoute from "./routes/SessionRoute";
import PaiementRoute from "./routes/PaiementRoute";
import CertificationRoute from "./routes/CertificationRoute";
import QuizRoute from "./routes/QuizRoute";
import QuestionRoute from "./routes/QuestionRoute";
import ReponseRoute from "./routes/ReponseRoute";
import ProgressionRoute from "./routes/ProgressionRoute";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import cors from "cors";


const app = express();
const port = 4004;

app.use(cors({
  origin: "http://localhost:5173"
}));


app.use(express.json())


// Swagger - Configuration complète avec options pour tester les endpoints
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
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
  res.send(swaggerDocument);
});

app.use("/auth", AuthRoute)
app.use("/users", UtilisateurRoute)
app.use("/profs",ProfesseurRoute)
app.use("/apprenants", ApprenantRoute)
app.use("/admin", AdministrateurRoute)
app.use("/formations", FormationRoute)
app.use("/sessions", SessionRoute)
app.use("/paiements", PaiementRoute)
app.use("/certifications", CertificationRoute)
app.use("/quiz", QuizRoute)
app.use("/questions", QuestionRoute)
app.use("/reponses", ReponseRoute)
app.use("/progressions", ProgressionRoute)

app.listen(port, ()=>{
    console.log(`Le serveur est en marche au http://localhost:${port}`);
})

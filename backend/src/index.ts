import express, { Express } from "express";

const port = 4004;
const app: Express = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
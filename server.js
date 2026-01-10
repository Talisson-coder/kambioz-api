import express from "express";
import ratesHandler from "./api/rates.js";

const app = express();
const PORT = process.env.PORT || 3000;

// rota principal
app.get("/", (req, res) => {
  res.send("Kambioz API online 🚀");
});

// rota de taxas
app.get("/api/rates", ratesHandler);

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

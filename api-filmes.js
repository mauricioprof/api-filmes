import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Caminho absoluto para filmes.json
const filmesPath = path.resolve("./filmes.json");

let filmes = [];
fs.readFile(filmesPath, "utf-8")
  .then(data => {
    filmes = JSON.parse(data);
    console.log(`Filmes carregados: ${filmes.length}`);
  })
  .catch(err => console.error("Erro ao ler filmes.json:", err));

// Rota inicial
app.get("/", (req, res) => {
  res.send("API cinema - Use: /filmes para acessar dados.");
});

app.get("/sobre", (req, res) => {
  res.send("API cinema - by Prof. Mauricio Santos©");
});


// Rota para todos os filmes
app.get("/filmes", (req, res) => {
  res.json(filmes);
});

// Rota por ID
app.get("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find(f => f.id === id);
  if (filme) res.json(filme);
  else res.status(404).json({ erro: "Filme não encontrado" });
});

// Rota por letra inicial
app.get("/filmes/letra/:letra", (req, res) => {
  const letra = req.params.letra.toUpperCase();
  const filtrados = filmes.filter(f => f.titulo.toUpperCase().startsWith(letra));
  res.json(filtrados);
});

// Inicia servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API de filmes rodando na porta ${PORT}`);
});

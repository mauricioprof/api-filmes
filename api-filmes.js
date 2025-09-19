import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();

// Porta fornecida pelo Railway
const PORT = process.env.PORT || 3000;

// Caminho absoluto para filmes.json (para garantir que funcione no Railway)
const filmesPath = path.resolve("./filmes.json");

let filmes = [];
fs.readFile(filmesPath, "utf-8")
  .then(data => {
    filmes = JSON.parse(data);
    console.log(`Filmes carregados: ${filmes.length}`);
  })
  .catch(err => console.error("Erro ao ler filmes.json:", err));

// Rota inicial para evitar Not Found
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Filmes! Use /filmes para acessar os dados.");
});

// Rota para todos os filmes ou filtrando por gênero
app.get("/filmes", (req, res) => {
  const { genero } = req.query;
  if (genero) {
    const filtrados = filmes.filter(f => f.genero.toLowerCase() === genero.toLowerCase());
    res.json(filtrados);
  } else {
    res.json(filmes);
  }
});

// Rota para filme específico por ID
app.get("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find(f => f.id === id);
  if (filme) {
    res.json(filme);
  } else {
    res.status(404).json({ erro: "Filme não encontrado" });
  }
});

// Rota para buscar filmes por letra inicial do título
app.get("/filmes/letra/:letra", (req, res) => {
  const letra = req.params.letra.toUpperCase();
  const filtrados = filmes.filter(f => f.titulo.toUpperCase().startsWith(letra));
  res.json(filtrados);
});

// Inicia servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API de filmes rodando na porta ${PORT}`);
});


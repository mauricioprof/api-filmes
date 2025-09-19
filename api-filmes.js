import express from "express";
import fs from "fs/promises";

const app = express();

// Railway define a porta automaticamente → usa process.env.PORT
const PORT = process.env.PORT || 3000;

// Carrega filmes do arquivo JSON
let filmes = [];
fs.readFile("filmes.json", "utf-8")
  .then(data => filmes = JSON.parse(data))
  .catch(err => console.error("Erro ao ler filmes.json:", err));

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

// Inicia servidor (0.0.0.0 para permitir acesso externo)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API de filmes rodando na porta ${PORT}`);
});

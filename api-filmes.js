import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

//Habilita CORS para todas as origens (didático para testes/ensino)
app.use(cors());

//Caminho absoluto para o arquivo filmes.json
const filmesPath = path.resolve("./filmes.json");

//Carregar filmes do JSON
let filmes = [];
fs.readFile(filmesPath, "utf-8")
  .then(data => {
    filmes = JSON.parse(data);
    console.log(`Filmes carregados: ${filmes.length}`);
  })
  .catch(err => console.error("Erro ao ler filmes.json:", err));

// Rota inicial
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Filmes! Use /filmes para acessar os dados.");
});

//Rota para todos os filmes ou filtrando por gênero
app.get("/filmes", (req, res) => {
  const { genero } = req.query;
  if (genero) {
    const filtrados = filmes.filter(
      f => f.genero.toLowerCase() === genero.toLowerCase()
    );
    res.json(filtrados);
  } else {
    res.json(filmes);
  }
});

//Rota para filme específico por ID
app.get("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find(f => f.id === id);
  if (filme) {
    res.json(filme);
  } else {
    res.status(404).json({ erro: "Filme não encontrado" });
  }
});

//Rota para buscar filmes por letra inicial do título
app.get("/filmes/letra/:letra", (req, res) => {
  const letra = req.params.letra.toUpperCase();
  const filtrados = filmes.filter(f =>
    f.titulo.toUpperCase().startsWith(letra)
  );
  res.json(filtrados);
});

// Rota de busca por título (flexível)
app.get("/filmes/busca", (req, res) => {
  const { titulo } = req.query;

  if (!titulo) return res.status(400).json({ erro: "Informe o parâmetro 'titulo'" });

  const termo = titulo.trim().toLowerCase();

  const resultados = filmes.filter(f => f.titulo.toLowerCase().includes(termo));

  if (resultados.length === 0) return res.status(404).json({ erro: "Filme não encontrado" });

  res.json(resultados);
});


//Inicia servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API de filmes rodando na porta ${PORT}`);
});

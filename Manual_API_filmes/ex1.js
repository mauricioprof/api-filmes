async function listarFilmes() {
  let resposta = await fetch("https://api-filmes-production-9408.up.railway.app/filmes");
  let filmes = await resposta.json();
  console.log(filmes);
}
listarFilmes();

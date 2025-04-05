//import Grafo from '../models/Grafo.js';

//const grafo = new Grafo();

const adicionarVertice = (req, res) => {
  //grafo.adicionarVertice(req.body.vertice);
  res.json({ message: "Vertice adicionado" });
};

const adicionarAresta = (req, res) => {
  //const { origem, destino } = req.body;
  //grafo.adicionarAresta(origem, destino);
  res.json({ message: "Aresta adicionada" });
};

const bfs = (req, res) => {
  //const resultado = grafo.bfs(req.params.vertice);
  res.json({ caminho: resultado });
};

const dfs = (req, res) => {
  //const resultado = grafo.dfs(req.params.vertice);
  res.json({ caminho: resultado });
};

export default {
  adicionarVertice,
  adicionarAresta,
  bfs,
  dfs
};

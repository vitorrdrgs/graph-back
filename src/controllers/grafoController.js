import Grafo from '../models/Grafo.js';

const grafo = new Grafo();

exports.adicionarVertice = (req, res) => {
  grafo.adicionarVertice(req.body.vertice);
  res.json({ message: "Vertice adicionado" });
};

exports.adicionarAresta = (req, res) => {
  const { origem, destino } = req.body;
  grafo.adicionarAresta(origem, destino);
  res.json({ message: "Aresta adicionada" });
};

exports.bfs = (req, res) => {
  const resultado = grafo.bfs(req.params.vertice);
  res.json({ caminho: resultado });
};

exports.dfs = (req, res) => {
  const resultado = grafo.dfs(req.params.vertice);
  res.json({ caminho: resultado });
};

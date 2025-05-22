export const middleware_search_algorithms_input_verify = (req, res, next) => {
  const { edges, n, source, destination } = req.body;
  const { algorithm } = req.params

  if (
    !Array.isArray(edges) ||
    typeof n !== 'number' ||
    typeof source !== 'number' ||
    typeof destination !== 'number'
  ) {
    return res.status(400).json({ error: 'Entrada inválida: verifique edges, n, source e destination.' });
  }

  if (source < 0 || source >= n || destination < 0 || destination >= n) {
    return res.status(400).json({ error: 'Source ou destination estão fora do intervalo permitido.' });
  }

  if (algorithm !== 'dijkstra' && algorithm !== 'bfs' && algorithm !== 'dfs') {
    return res.status(400).json({ error: 'Algoritmo inválido' });
  }

  next();
};

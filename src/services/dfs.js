export function dfs(graph, source) {
  const n = graph.size()
  const visited = new Array(n).fill(false)
  const parent = new Array(n).fill(-1)
  const cost = new Array(n).fill(Number.MAX_VALUE)
  const order = []

  const stack = [{ vertex: source, depth: 0 }]
  parent[source] = source
  cost[source] = 0

  while (stack.length > 0) {
    const { vertex: u, depth } = stack.pop()

    if (!visited[u]) {
      visited[u] = true
      cost[u] = depth
      order.push(u)

      const neighbors = graph
        .neighbors(u)
        .map(({ vertex }) => vertex)
        .filter((v) => !visited[v])
        .sort((a, b) => b - a)

      for (const v of neighbors) {
        if (parent[v] === -1) parent[v] = u
        stack.push({ vertex: v, depth: depth + 1 })
      }
    }
  }

  return { parent, cost, order }
}

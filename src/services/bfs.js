export function bfs(graph, source) {
  const n = graph.size()
  const visited = new Array(n).fill(false)
  const parent = new Array(n).fill(-1)
  const cost = new Array(n).fill(Number.MAX_VALUE)
  const order = []
  const queue = [source]

  visited[source] = true
  parent[source] = source
  cost[source] = 0

  while (queue.length > 0) {
    const u = queue.shift()
    order.push(u)

    for (const { vertex: v } of graph.neighbors(u)) {
      if (!visited[v]) {
        visited[v] = true
        parent[v] = u
        cost[v] = cost[u] + 1
        queue.push(v)
      }
    }
  }

  return { parent, cost, order }
}

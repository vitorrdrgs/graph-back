export function bfs(graph, source) {
  const n = graph.size()
  const visited = new Array(n).fill(false)
  const queue = [source]
  const order = []

  visited[source] = true

  while (queue.length > 0) {
    const u = queue.shift()
    order.push(u)

    for (const { vertex: v } of graph.neighbors(u)) {
      if (!visited[v]) {
        visited[v] = true
        queue.push(v)
      }
    }
  }

  return order
}

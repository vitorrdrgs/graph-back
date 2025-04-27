class GraphList {
  #graph = []

  constructor(edges, n) {
    for (let i = 0; i < n; i++) {
      this.#graph.push([])
    }

    for (const edge of edges) {
      if (edge.length >= 3) {
        this.insert(edge[0], edge[1], edge[2])
      } else {
        this.insert(edge[0], edge[1])
      }
    }
  }

  insert(u, v, weight = 1) {
    this.#graph[u].push({ vertex: v, weight })
    this.#graph[v].push({ vertex: u, weight })
  }

  delete(u, v) {
    this.#graph[u] = this.#graph[u].filter((neigh) => neigh.vertex !== v)
    this.#graph[v] = this.#graph[v].filter((neigh) => neigh.vertex !== u)
  }

  neighbors(u) {
    return this.#graph[u]
  }

  edge(u, v) {
    for (const neighbor of this.#graph[u]) {
      if (neighbor.vertex === v) return neighbor.weight
    }
    return 0
  }

  size() {
    return this.#graph.length
  }

  to_json() {
    return JSON.stringify({ graph: this.#graph })
  }

  to_object() {
    return { graph: this.#graph }
  }
}

export default GraphList

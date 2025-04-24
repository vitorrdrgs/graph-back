export function dot(graph) {
  let dot_return = 'graph G {\n'

  for (let u = 0; u < graph.size(); u++) {
    for (const { vertex: v } of graph.neighbors(u)) {
      // evita duplicar arestas não direcionadas
      if (u < v) {
        dot_return += `  ${u} -- ${v};\n`
      }
    }
  }

  dot_return += '}'

  return dot_return
}

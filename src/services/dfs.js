export function dfs(graph, source) {
    const n = graph.size();
    const visited = new Array(n).fill(false);
    const stack = [source];
    const order = [];

    while (stack.length > 0) {
        const u = stack.pop();

        if (!visited[u]) {
            visited[u] = true;
            order.push(u);

            // Adiciona os vizinhos em ordem reversa para manter comportamento semelhante
            const neighbors = graph.neighbors(u)
                .map(({ vertex }) => vertex)
                .filter(v => !visited[v])
                // ordem decrescente para simular visita da esquerda pra direita
                .sort((a, b) => b - a);

            stack.push(...neighbors);
        }
    }

    return order;
}

export function bfs(graph, source) {
    const n = graph.size();
    const visited = new Array(n).fill(false);
    const queue = [source];
    const order = [];

    visited[source] = true;

    while (queue.length > 0) {
        const u = queue.shift();
        order.push(u);

        for (let v = 0; v < n; v++) {
            if (graph.edge(u, v) !== 0 && !visited[v]) {
                visited[v] = true;
                queue.push(v);
            }
        }
    }

    // Ordem de visita dos vértices
    return order;
}

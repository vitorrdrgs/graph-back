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

            for (let v = n - 1; v >= 0; v--) {
                if (graph.edge(u, v) !== 0 && !visited[v]) {
                    stack.push(v);
                }
            }
        }
    }

    return order;
}

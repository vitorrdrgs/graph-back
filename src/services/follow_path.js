export function follow_path(parent_cost, destination) {
    const { parent, cost } = parent_cost;

    if (destination >= parent.length || destination < 0)
        return { path: [], cost: 0 };

    let path = [];
    let cur = destination;

    while (cur !== parent[cur]) {
        path.push(cur);
        cur = parent[cur];
    }

    path.push(cur);
    path.reverse();

    return { path: path, cost: cost[destination] };
}

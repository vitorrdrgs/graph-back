import MinHeap from "./min_heap.js"
import GraphMatrix from "../models/graph_matrix.js";

export function dijkstra(graph, source) {
    const n = graph.size();
    const parent = new Array(n).fill(-1);
    const cost = new Array(n).fill(Number.MAX_VALUE);
    const visited = new Array(n).fill(false);
    const heap = new MinHeap();

    // Initialize source vertex
    parent[source] = source;
    cost[source] = 0;
    heap.insert({ vertex: source, cost: 0 });

    while (!heap.empty()) {
        const { vertex: vertex, cost: current_cost } = heap.extract();
        visited[vertex] = true;

        // Explore the neighbors
        for (let i = 0; i < n; i++) {
            const weight = graph.edge(vertex, i);
            if (weight !== 0 && !visited[i]) {
                const new_cost = current_cost + weight;
                if (new_cost < cost[i]) {
                    cost[i] = new_cost;
                    parent[i] = vertex;

                    // If the neighbor has not been visited, insert it into the heap
                    heap.insert({ vertex: i, cost: new_cost });
                }
            }
        }
    }
    return { parent, cost };
}

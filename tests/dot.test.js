import { dot } from "../src/services/dot.js";
import GraphMatrix from "../src/models/graph_matrix.js";
import GraphList from "../src/models/graph_list.js";

test("Graph matrix to DOT", () => {
    const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [0, 3]
    ];

    const graph_matrix = new GraphMatrix(edges, 5);

    const dot_return = dot(graph_matrix);

    expect(dot_return).toContain('  0 -- 1;\n');
    expect(dot_return).toContain('  1 -- 2;\n');
    expect(dot_return).toContain('  2 -- 3;\n');
    expect(dot_return).toContain('  0 -- 3;\n');
});

test("Graph list to DOT", () => {
    const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0]
    ];

    const graph_list = new GraphList(edges, 5);

    const dot_return = dot(graph_list);
    expect(dot_return).toContain('  0 -- 1;\n');
    expect(dot_return).toContain('  1 -- 2;\n');
    expect(dot_return).toContain('  2 -- 3;\n');
    expect(dot_return).toContain('  0 -- 3;\n');
});

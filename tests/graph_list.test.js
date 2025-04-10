import GraphList from "../src/models/graph_list.js";

test("Create a weighted graph", () => {
    const edges = [
        [0, 1, 2],
        [1, 2, 3],
        [2, 0, 4]
    ];

    const graph = new GraphList(edges, 3);

    expect(graph.to_object()).toEqual({
        graph: [
            [ { vertex: 1, weight: 2 }, { vertex: 2, weight: 4 } ],
            [ { vertex: 0, weight: 2 }, { vertex: 2, weight: 3 } ],
            [ { vertex: 1, weight: 3 }, { vertex: 0, weight: 4 } ]
        ]
    });
});

test("Create a non weighted graph", () => {
    const edges = [
        [0, 1],
        [1, 2],
        [2, 0]
    ];

    const graph = new GraphList(edges, 3);

    expect(graph.to_object()).toEqual({
        graph: [
            [ { vertex: 1, weight: 1 }, { vertex: 2, weight: 1 } ],
            [ { vertex: 0, weight: 1 }, { vertex: 2, weight: 1 } ],
            [ { vertex: 1, weight: 1 }, { vertex: 0, weight: 1 } ]
        ]
    });
});

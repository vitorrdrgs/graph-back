import GraphList from '../src/models/graph_list.js'
import GraphMatrix from '../src/models/graph_matrix.js'
import { bfs } from '../src/services/bfs.js'

test('BFS traversal from node 0 in graph list', () => {
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
  ]

  const graph_list = new GraphList(edges, 5)

  const order = bfs(graph_list, 0)

  expect(order).toEqual([0, 1, 4, 2, 3])
})

test('BFS traversal from node 0 in graph matrix', () => {
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
  ]

  const graph_matrix = new GraphMatrix(edges, 5)

  const order = bfs(graph_matrix, 0)

  expect(order).toEqual([0, 1, 4, 2, 3])
})

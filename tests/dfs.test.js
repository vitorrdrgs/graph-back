import GraphList from '../src/models/graph_list.js'
import GraphMatrix from '../src/models/graph_matrix.js'
import { dfs } from '../src/services/dfs.js'

test('DFS traversal from node 0 in graph list', () => {
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
  ]

  const graph_list = new GraphList(edges, 5)

  const { parent, cost, order } = dfs(graph_list, 0)

  expect(parent).toEqual([0, 0, 1, 2, 0])
  expect(cost).toEqual([0, 1, 2, 3, 1])
  expect(order).toEqual([0, 1, 2, 3, 4])
})

test('DFS traversal from node 0 in graph matrix', () => {
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
  ]

  const graph_matrix = new GraphMatrix(edges, 5)

  const { parent, cost, order } = dfs(graph_matrix, 0)

  expect(parent).toEqual([0, 0, 1, 2, 0])
  expect(cost).toEqual([0, 1, 2, 3, 1])
  expect(order).toEqual([0, 1, 2, 3, 4])
})

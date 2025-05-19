import Graph from '../models/graph.js'

import GraphMatrix from '../models/graph_matrix.js'
import GraphList from '../models/graph_list.js'

import { follow_path } from '../services/follow_path.js'
import { dfs } from '../services/dfs.js'
import { bfs } from '../services/bfs.js'
import { dijkstra } from '../services/dijkstra.js'

const ensure_user_owns_graph = (graph, user_id) => {
  if (!graph) throw new Error('NOT_FOUND')
  if (graph.user_id !== user_id) throw new Error('FORBIDDEN')
}

/**
 * Retrieves a graph by its ID, ensuring the authenticated user is the owner.
 *
 * @route GET /graphs/:id
 * @middleware Requires authentication middleware to populate req.user_info
 * @param {Request} req - Express request with `params.id` and `user_info.id` injected by middleware.
 * @param {Response} res - Express response.
 * @returns {200} JSON object of the graph if successful.
 * @returns {404} If the graph does not exist.
 * @returns {403} If the graph does not belong to the authenticated user.
 * @returns {500} On internal server error.
 */
const grafo_id = async (req, res) => {
  const graph_id = req.params.id
  const user_id = req.user_info.id

  console.log(user_id)

  try{
    const graph = await Graph.get_graph_by_id(graph_id)
    
    ensure_user_owns_graph(graph, user_id)

    const grafo_formatado = graph.to_object()

    return res.status(200).json(grafo_formatado)
  } catch(err){
    if (err.message === 'NOT_FOUND') return res.status(404).json({ erro: 'não existe um grafo com esse id'})
    if (err.message === 'FORBIDDEN') return res.status(403).json({ erro: 'esse grafo não pertence a esse usuário'})
    return res.status(500).json({ erro: 'erro interno no servidor. '})
  }
}

/**
 * Updates a graph by its ID, modifying vertices and edges.
 * Requires authentication via middleware.
 *
 * @route PUT /graphs/update/:id
 * @middleware Requires authentication middleware to populate req.user_info
 * @param {Request} req - Express request with `params.id`, optional graph changes, and `user_info.id` injected by middleware.
 * @param {Response} res - Express response.
 * @returns {200} Updated graph JSON.
 * @returns {404} If the graph does not exist.
 * @returns {403} If the graph does not belong to the authenticated user.
 * @returns {500} On internal server error.
 */
const update_grafo_id = async (req, res) => {
  const graph_id = req.params.id
  const user_id = req.user_info.id

  try{
    const graph = await Graph.get_graph_by_id(graph_id)

    ensure_user_owns_graph(graph, user_id)

    //graph.vertices[0].label = 'Alterado'
    //graph.vertices[0].x = 777
    //graph.vertices[0].y = 666

    graph.vertices.push({ id: null, label: "C", number: 10, x: -300, y: -50, geometry: 'triangle', color: "#FFFFFF" })
    graph.vertices.push({ id: null, label: "D", number: 11, x: -300, y: -50, geometry: 'triangle', color: "#FFFFFF" })

    await graph.update()

    const grafo_formatado = graph.to_object()

    return res.status(200).json(grafo_formatado)
  }catch(err){
    if (err.message === 'NOT_FOUND') return res.status(404).json({ erro: 'não existe um grafo com esse id'})
    if (err.message === 'FORBIDDEN') return res.status(403).json({ erro: 'esse grafo não pertence a esse usuário'})
    return res.status(500).json({ erro: 'erro interno no servidor. '})
  }
}

/**
 * Searches for a path between two nodes in a graph using the specified algorithm and graph representation.
 *
 * @route POST /:algorithm/:method
 * @middleware Requires middleware_search_algorithms_input_verify to validate inputs.
 *
 * @param {Request} req - Express request object.
 * @param {Object} req.body - Graph data.
 * @param {Array<Array<number>>} req.body.edges - Edges of the graph in [from, to, weight] format.
 * @param {number} req.body.n - Number of nodes in the graph.
 * @param {number} req.body.source - Source node index.
 * @param {number} req.body.destination - Destination node index.
 * @param {Object} req.params - URL parameters.
 * @param {string} req.params.algorithm - One of "dijkstra", "bfs", or "dfs".
 * @param {string} req.params.method - One of "matrix" (adjacency matrix) or "list" (adjacency list).
 *
 * @param {Response} res - Express response object.
 * @returns {200} Path and cost as returned by `follow_path`, e.g. { path: [0,1,2], cost: 4 }.
 * @returns {500} On internal server error.
 *
 * @example
 * POST /dijkstra/list
 * {
 *   "edges": [[0, 1, 2], [1, 2, 2]],
 *   "n": 3,
 *   "source": 0,
 *   "destination": 2
 * }
 * => Response: { path: [0, 1, 2], cost: 4 }
 */
const search_path = async (req, res) => {
  const {edges, n, source, destination} = req.body
  const {algorithm, method} = req.params

  const methodMap = {
    list: GraphList,
    matrix: GraphMatrix,
  };

  const algorithmMap = {
    dijkstra,
    bfs,
    dfs,
  };

  try{
    const GraphConstructor = methodMap[method];
    const algorithmFn = algorithmMap[algorithm];

    const graph = new GraphConstructor(edges, n);
    const parentCost = algorithmFn(graph, source);
    const pathCost = follow_path(parentCost, destination);

    return res.status(200).json(pathCost);
  }catch(err){
    return res.status(500).json({ erro: 'erro interno no servidor. '})
  }
}

/**
 * Creates a new empty graph associated with the authenticated user.
 *
 * @route POST /graphs/create
 * @middleware Requires authentication middleware to populate req.user_info
 * @param {Request} req - Request body must include { name }. Auth info via req.user_info.id.
 * @param {Response} res - Returns the created graph object.
 * @returns {200} Created graph JSON.
 * @returns {500} On internal server error.
 */
const create_graph = async (req, res) => {
  const { name } = req.body
  const { id } = req.user_info

  try{
    const graph = new Graph(name, id)

    await graph.create()

    const grafo_formatado = graph.to_object()
    return res.status(200).json(grafo_formatado)
  }catch{
    return res.status(500).json({ erro: 'erro interno no servidor. '})
  }
}

/**
 * Generates an adjacency matrix representation of a graph.
 *
 * @route POST /graphs/adjacency-matrix
 * @param {Request} req - Request body must include:
 *   - { edges: [ [u, v, weight], ... ], n: number }.
 * @param {Response} res - Returns the adjacency matrix representation of the graph.
 * @returns {200} JSON with the matrix as { graph: number[][] }.
 * @returns {500} On internal server error.
 */
const adjacency_matrix = async (req, res) => {
  const { edges, n } = req.body;

  try {
    const graph = new GraphMatrix(edges, n);
    console.log(graph);

    return res.status(200).json(graph.to_object());
  } catch {
    return res.status(500).json({ erro: 'erro interno no servidor. ' });
  }
};

/**
 * Generates an adjacency list representation of a graph.
 *
 * @route POST /graphs/adjacency-list
 * @param {Request} req - Request body must include:
 *   - { edges: [ [u, v, weight], ... ], n: number }.
 * @param {Response} res - Returns the adjacency list representation of the graph.
 * @returns {200} JSON with the list as { graph: Array<Array<{ vertex: number, weight: number }>> }.
 * @returns {500} On internal server error.
 */
const adjacency_list = async (req, res) => {
  const { edges, n } = req.body;

  try {
    const graph = new GraphList(edges, n);

    return res.status(200).json(graph.to_object());
  } catch {
    return res.status(500).json({ erro: 'erro interno no servidor. ' });
  }
};

export default {
  grafo_id,
  update_grafo_id,
  search_path,
  create_graph,
  adjacency_matrix,
  adjacency_list
}

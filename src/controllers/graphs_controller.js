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

  try {
    const graph = await Graph.get_graph_by_id(graph_id)

    ensure_user_owns_graph(graph, user_id)

    const grafo_formatado = graph.to_object()

    return res.status(200).json(grafo_formatado)
  } catch (err) {
    if (err.message === 'NOT_FOUND')
      return res.status(404).json({ erro: 'não existe um grafo com esse id' })
    if (err.message === 'FORBIDDEN')
      return res
        .status(403)
        .json({ erro: 'esse grafo não pertence a esse usuário' })
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
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
  const { vertices, edges } = req.body

  if (!Array.isArray(vertices) || !Array.isArray(edges)) {
    return res
      .status(400)
      .json({ erro: 'vertices e edges precisam ser arrays válidos' })
  }

  try {
    const graph = await Graph.get_graph_by_id(graph_id)

    ensure_user_owns_graph(graph, user_id)

    graph.vertices = vertices
    graph.edges = edges

    await graph.update()

    const grafo_formatado = graph.to_object()

    return res.status(200).json(grafo_formatado)
  } catch (err) {
    if (err.message === 'NOT_FOUND')
      return res.status(404).json({ erro: 'não existe um grafo com esse id' })
    if (err.message === 'FORBIDDEN')
      return res
        .status(403)
        .json({ erro: 'esse grafo não pertence a esse usuário' })
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
  }
}

/**
 * Calculates the shortest path between source and destination using Dijkstra's algorithm on an adjacency list.
 *
 * @route POST /graphs/dijkstra/list
 * @param {Request} req - Request body must contain { edges, n, source, destination }.
 * @param {Response} res - Returns the shortest path and cost.
 * @returns {200} Path and cost.
 * @returns {500} On internal server error.
 */
const dijkstra_list = async (req, res) => {
  const { edges, n, source, destination } = req.body

  try {
    const graph = new GraphList(edges, n)

    const parent_cost = dijkstra(graph, source)
    const path_cost = follow_path(parent_cost, destination)

    return res.status(200).json(path_cost)
  } catch (err) {
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
  }
}

/**
 * Calculates the shortest path between source and destination using Dijkstra's algorithm on an adjacency matrix.
 *
 * @route POST /graphs/dijkstra/matrix
 * @param {Request} req - Request body must contain { edges, n, source, destination }.
 * @param {Response} res - Returns the shortest path and cost.
 * @returns {200} Path and cost.
 * @returns {500} On internal server error.
 */
const dijkstra_matrix = async (req, res) => {
  const { edges, n, source, destination } = req.body

  try {
    const graph = new GraphMatrix(edges, n)

    const parent_cost = dijkstra(graph, source)
    const path_cost = follow_path(parent_cost, destination)

    return res.status(200).json(path_cost)
  } catch (err) {
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
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

  try {
    const graph = new Graph(name, id)

    await graph.create()

    const grafo_formatado = graph.to_object()
    return res.status(200).json(grafo_formatado)
  } catch {
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
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
  const { edges, n } = req.body

  try {
    const graph = new GraphMatrix(edges, n)
    console.log(graph)

    return res.status(200).json(graph.to_object())
  } catch {
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
  }
}

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
  const { edges, n } = req.body

  try {
    const graph = new GraphList(edges, n)

    return res.status(200).json(graph.to_object())
  } catch {
    return res.status(500).json({ erro: 'erro interno no servidor. ' })
  }
}

export default {
  grafo_id,
  update_grafo_id,
  dijkstra_list,
  dijkstra_matrix,
  create_graph,
  adjacency_matrix,
  adjacency_list,
}

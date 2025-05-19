import express from 'express'
import graphs_controller from '../controllers/graphs_controller.js'

import { middleware_search_algorithms_input_verify } from '../middlewares/source_destination_verify.js'
import { middleware_token_verify } from '../middlewares/token_verify.js'

var router = express.Router()

router.get('/:id', middleware_token_verify, graphs_controller.grafo_id)
router.put('/update/:id', middleware_token_verify, graphs_controller.update_grafo_id)
router.post('/create', middleware_token_verify, graphs_controller.create_graph)

router.post('/:algorithm/:method', middleware_search_algorithms_input_verify, graphs_controller.search_path)

router.post('/matrix', graphs_controller.adjacency_matrix)
router.post('/list', graphs_controller.adjacency_list)

export default router

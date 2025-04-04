const express = require('express');
const router = express.Router();
const grafoController = require('../controllers/grafoController');

router.post('/adicionar_vertice', grafoController.adicionarVertice);
router.post('/adicionar_aresta', grafoController.adicionarAresta);
router.get('/bfs/vertice', grafoController.bfs);
router.get('/dfs/vertice', grafoController.dfs);

module.exports = router;

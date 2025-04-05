import express from 'express';
import grafoController from '../controllers/grafoController.js';

const router = express.Router();

router.post('/adicionar_vertice', grafoController.adicionarVertice);
router.post('/adicionar_aresta', grafoController.adicionarAresta);
router.get('/bfs/vertice', grafoController.bfs);
router.get('/dfs/vertice', grafoController.dfs);

export default router;

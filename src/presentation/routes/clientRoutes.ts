import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';
import { authMiddleware } from '../middlewares/authMiddleware';

const clientRoutes = Router();
const clientController = new ClientController();

clientRoutes.use(authMiddleware);
clientRoutes.post('/', (req, res) => clientController.create(req, res));
clientRoutes.get('/', (req, res) => clientController.list(req, res));
clientRoutes.get('/:id', (req, res) => clientController.getById(req, res));
clientRoutes.put('/:id', (req, res) => clientController.update(req, res));
clientRoutes.delete('/:id', (req, res) => clientController.delete(req, res));

export { clientRoutes };

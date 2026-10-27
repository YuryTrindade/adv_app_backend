import { Router } from 'express';
import { HearingController } from '../controllers/HearingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const hearingRoutes = Router();
const hearingController = new HearingController();

hearingRoutes.use(authMiddleware);
hearingRoutes.post('/', (req, res) => hearingController.create(req, res));
hearingRoutes.get('/', (req, res) => hearingController.list(req, res));
hearingRoutes.get('/upcoming', (req, res) => hearingController.getUpcoming(req, res));
hearingRoutes.get('/:id', (req, res) => hearingController.getById(req, res));
hearingRoutes.put('/:id', (req, res) => hearingController.update(req, res));
hearingRoutes.delete('/:id', (req, res) => hearingController.delete(req, res));

export { hearingRoutes };

import { Router } from 'express';
import multer from 'multer';
import { DiligenceController } from '../controllers/DiligenceController';
import { authMiddleware } from '../middlewares/authMiddleware';

const upload = multer({ dest: 'uploads/diligences/' });
const diligenceRoutes = Router();
const diligenceController = new DiligenceController();

diligenceRoutes.use(authMiddleware);
diligenceRoutes.post('/', (req, res) => diligenceController.create(req, res));
diligenceRoutes.get('/', (req, res) => diligenceController.list(req, res));
diligenceRoutes.get('/pending', (req, res) => diligenceController.getPending(req, res));
diligenceRoutes.get('/:id', (req, res) => diligenceController.getById(req, res));
diligenceRoutes.put('/:id', (req, res) => diligenceController.update(req, res));
diligenceRoutes.delete('/:id', (req, res) => diligenceController.delete(req, res));
diligenceRoutes.post('/:id/documents', upload.single('document'), (req, res) => diligenceController.uploadDocument(req, res));

export { diligenceRoutes };

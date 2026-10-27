import { Router } from 'express';
import { AddCaseHistoryUseCase } from '../../application/use-cases/AddCaseHistoryUseCase';
import { CreateCaseUseCase } from '../../application/use-cases/CreateCaseUseCase';
import { PrismaCaseRepository } from '../../infrastructure/database/PrismaCaseRepository';
import { CaseController } from '../controllers/CaseController';
import { authMiddleware } from '../middlewares/authMiddleware';

const caseRoutes = Router();

const caseRepository = new PrismaCaseRepository();
const createCaseUseCase = new CreateCaseUseCase(caseRepository);
const addCaseHistoryUseCase = new AddCaseHistoryUseCase(caseRepository);
const caseController = new CaseController(createCaseUseCase, addCaseHistoryUseCase, caseRepository);

caseRoutes.use(authMiddleware);
caseRoutes.post('/', (req, res) => caseController.create(req, res));
caseRoutes.get('/', (req, res) => caseController.list(req, res));
caseRoutes.get('/:id', (req, res) => caseController.getById(req, res));
caseRoutes.put('/:id', (req, res) => caseController.update(req, res));
caseRoutes.delete('/:id', (req, res) => caseController.delete(req, res));
caseRoutes.post('/:id/history', (req, res) => caseController.addHistory(req, res));

export { caseRoutes };

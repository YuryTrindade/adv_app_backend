import { Router } from 'express';
import { CalendarController } from '../controllers/CalendarController';
import { authMiddleware } from '../middlewares/authMiddleware';

const calendarRoutes = Router();
const calendarController = new CalendarController();

calendarRoutes.use(authMiddleware);
calendarRoutes.get('/auth-url', (req, res) => calendarController.getAuthUrl(req, res));
calendarRoutes.post('/callback', (req, res) => calendarController.callback(req, res));
calendarRoutes.post('/disconnect', (req, res) => calendarController.disconnect(req, res));

export { calendarRoutes };

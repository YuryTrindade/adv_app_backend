import { Router } from 'express';
import multer from 'multer';
import { ProfileController } from '../controllers/ProfileController';
import { authMiddleware } from '../middlewares/authMiddleware';

const upload = multer({ dest: 'uploads/avatars/' });
const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.use(authMiddleware);
profileRoutes.put('/', (req, res) => profileController.update(req, res));
profileRoutes.post('/avatar', upload.single('avatar'), (req, res) => profileController.uploadAvatar(req, res));

export { profileRoutes };
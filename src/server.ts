import cors from 'cors';
import express from 'express';
import path from 'path';
import { authRoutes } from './presentation/routes/authRoutes';
import { calendarRoutes } from './presentation/routes/calendarRoutes';
import { caseRoutes } from './presentation/routes/caseRoutes';
import { clientRoutes } from './presentation/routes/clientRoutes';
import { diligenceRoutes } from './presentation/routes/diligenceRoutes';
import { hearingRoutes } from './presentation/routes/hearingRoutes';
import { profileRoutes } from './presentation/routes/profileRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Servir os uploads estáticos na pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/hearings', hearingRoutes);
app.use('/api/diligences', diligenceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/calendar', calendarRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import { mostrarTrabajos } from '../controllers/homeController.js';
const router = express.Router();

router.get('/', mostrarTrabajos);

export default router;
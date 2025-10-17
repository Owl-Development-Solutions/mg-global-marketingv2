import express from 'express';
import { getGeonology } from '../../controller';

const router = express.Router();

router.get('/users', getGeonology);

export default router;

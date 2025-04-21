import express from 'express';

import { authorize } from '../middleware/authorize.js';
import {GetAllLogs,GetLogs,CreateLog}from '../controllers/logsController.js';

const router=express.Router();

router.post('/',CreateLog)

router.get('/all',authorize('admin,supervisor'),GetAllLogs)

router.get('/stage/:id',GetLogs);


export default router;

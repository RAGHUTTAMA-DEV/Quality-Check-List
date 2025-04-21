import express from 'express';

import { authorize } from '../middleware/authorize.js';

const router=express.Router();

router.post('/',)

router.get('/all',authorize('admin,supervisor'),)

router.get('/stage/:id',);


export default router;

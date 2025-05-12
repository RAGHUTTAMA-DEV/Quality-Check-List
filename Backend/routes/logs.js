    import express from 'express';
    import { auth, authorize } from "../middleware/authorize.js";
    import { CreateLog, GetAllLogs, GetLogs } from "../controllers/logsController.js";
    const router = express.Router();

    router.post('/create', auth, authorize('admin', 'operator'), CreateLog);
    router.get('/all', auth, authorize('admin', 'supervisor'), GetAllLogs);
    router.get('/:name', auth, authorize('admin', 'supervisor'), GetLogs);

    export default router;

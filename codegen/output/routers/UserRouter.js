import express from 'express';
import * as UserHandler from '../../handler/user/user_service.js';

const router = express.Router();

// 根据模型生成的路由
router.post('/user/create', UserHandler.CreateUserMethod);
router.get('/user/allsimple', UserHandler.GetAllUsersSimpleMethod);
router.get('/user/all', UserHandler.GetAllUsersMethod);
router.get('/user/:id', UserHandler.GetUserByIdMethod);
router.put('/user/:id', UserHandler.UpdateUserMethod);
router.delete('/user/:id', UserHandler.DeleteUserMethod);

// 可以继续添加其他路由...

export default router;

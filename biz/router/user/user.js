
import express from 'express';
import * as user from '../../handler/user/user_service.js';

const router = express.Router();

// 使用导入的处理函数
router.post('/user', user.HelloUserMethod);
router.post('/user/1', user.HelloUserMethod);

// 继续添加其他路由...
export default router;

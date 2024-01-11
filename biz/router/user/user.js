
import express from 'express';
import * as user from '../../handler/user/user_service.js';

const router = express.Router();

// 使用导入的处理函数
router.post('/user/reg',user.RegisterMethod)
router.post('/user/login',user.LoginMethod)
router.post('/user/changepassword',user.ChangePasswordMethod)
// 继续添加其他路由...
export default router;

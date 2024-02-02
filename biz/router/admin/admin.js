
import express from 'express';
import * as admin from '../../handler/Admin/router.js';

const router = express.Router();

// 使用导入的处理函数
router.get('/get-router',admin.GetRouterMethod)
router.get('/role/get-roleable',admin.GetRouterTreeMethod)
// 继续添加其他路由...
export default router;

import express from 'express';
import * as RoleHandler from '../../handler/Admin/RoleHandler.js';

const router = express.Router();

// 根据模型生成的路由
router.post('/role/create', RoleHandler.CreateRoleMethod);
router.get('/role/allsimple', RoleHandler.GetAllRolesSimpleMethod);
router.get('/role/all', RoleHandler.GetAllRolesMethod);
router.get('/role/:id', RoleHandler.GetRoleByIdMethod);
router.put('/role/:id', RoleHandler.UpdateRoleMethod);
router.delete('/role/:id', RoleHandler.DeleteRoleMethod);
router.post('/role/route',RoleHandler.createOrUpdateRoleWithSelectedRoutesMethod)
router.get('/role/routes/:id',RoleHandler.getRoutesForRoleMethod)
// 可以继续添加其他路由...

export default router;

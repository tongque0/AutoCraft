import express from 'express';
import * as RoleRouteHandler from '../../handler/roleroute/rolerouteHandler.js';

const router = express.Router();

// 根据模型生成的路由
router.post('/roleroute/create', RoleRouteHandler.CreateRoleRouteMethod);
router.get('/roleroute/allsimple', RoleRouteHandler.GetAllRoleRoutesSimpleMethod);
router.get('/roleroute/all', RoleRouteHandler.GetAllRoleRoutesMethod);
router.get('/roleroute/Fields', RoleRouteHandler.GetRoleRouteByMultipleFieldsMethod);
router.get('/roleroute/:id', RoleRouteHandler.GetRoleRouteByIdMethod);
router.put('/roleroute/:id', RoleRouteHandler.UpdateRoleRouteMethod);
router.delete('/roleroute/:id', RoleRouteHandler.DeleteRoleRouteMethod);

// 可以继续添加其他路由...

export default router;

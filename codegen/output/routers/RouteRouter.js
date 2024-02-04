import express from 'express';
import * as RouteHandler from '../../handler/route/routeHandler.js';

const router = express.Router();

// 根据模型生成的路由
router.post('/route/create', RouteHandler.CreateRouteMethod);
router.get('/route/allsimple', RouteHandler.GetAllRoutesSimpleMethod);
router.get('/route/all', RouteHandler.GetAllRoutesMethod);
router.get('/route/Fields', RouteHandler.GetRouteByMultipleFieldsMethod);
router.get('/route/:id', RouteHandler.GetRouteByIdMethod);
router.put('/route/:id', RouteHandler.UpdateRouteMethod);
router.delete('/route/:id', RouteHandler.DeleteRouteMethod);

// 可以继续添加其他路由...

export default router;

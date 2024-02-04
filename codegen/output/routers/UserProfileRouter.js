import express from 'express';
import * as UserProfileHandler from '../../handler/userprofile/userprofileHandler.js';

const router = express.Router();

// 根据模型生成的路由
router.post('/userprofile/create', UserProfileHandler.CreateUserProfileMethod);
router.get('/userprofile/allsimple', UserProfileHandler.GetAllUserProfilesSimpleMethod);
router.get('/userprofile/all', UserProfileHandler.GetAllUserProfilesMethod);
router.get('/userprofile/Fields', UserProfileHandler.GetUserProfileByMultipleFieldsMethod);
router.get('/userprofile/:id', UserProfileHandler.GetUserProfileByIdMethod);
router.put('/userprofile/:id', UserProfileHandler.UpdateUserProfileMethod);
router.delete('/userprofile/:id', UserProfileHandler.DeleteUserProfileMethod);

// 可以继续添加其他路由...

export default router;

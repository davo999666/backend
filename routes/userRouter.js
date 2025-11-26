import express from "express";
import { userController } from "../controllers/userController.js";
import authenticationMiddleware from "../middleware/authentication.middleware.js";
import validation from "../middleware/validation.middleware.js";

const router = express.Router();


router.post('/login', validation('login'), userController.login);
router.post('/verification', validation('verification'), userController.verification);
router.post('/register', validation('register'), userController.register);
router.patch('/reset-password', authenticationMiddleware, validation("changePassword"), userController.resetPassword);
router.post("/forgot-password/:email", userController.forgotPassword);
router.post('/google/callback', userController.googleLogin);

export default router;

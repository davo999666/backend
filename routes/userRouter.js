import express from "express";
import { userController } from "../controllers/userController.js";
import authenticationMiddleware from "../middleware/authentication.middleware.js";
import validation from "../middleware/validation.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', validation('login'), userController.login);

/**
 * @swagger
 * /users/verification:
 *   post:
 *     summary: Verify user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid verification code
 */
router.post('/verification', validation('verification'), userController.verification);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration error
 */
router.post('/register', validation('register'), userController.register);

/**
 * @swagger
 * /users/reset-password:
 *   patch:
 *     summary: Reset user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/reset-password', authenticationMiddleware, validation("changePassword"), userController.resetPassword);

/**
 * @swagger
 * /users/forgot-password/{email}:
 *   post:
 *     summary: Forgot password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email
 *     responses:
 *       200:
 *         description: Reset email sent
 *       404:
 *         description: User not found
 */
router.post("/forgot-password/:email", userController.forgotPassword);

export default router;

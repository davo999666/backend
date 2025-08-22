import express from "express";
import userController from "../controllers/userController.js";
import validate from "../middleware/validation.middleware.js";


const router = express.Router();


router.post("/login",validate('login'), userController.login);
router.post("/register",validate('register'), userController.verifyEmil);
router.post("/verifyCode",validate('code'), userController.register);



export default router;
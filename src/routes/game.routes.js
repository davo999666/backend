import express from "express";
import gameController from "../controllers/gameController.js";
import authenticateToken from "../middleware/Authentication.middleware.js";
import validate from "../middleware/validation.middleware.js";


const router = express.Router();

router.get("/sentence",authenticateToken,validate('getSentences'), gameController.getSentences)


export default router;
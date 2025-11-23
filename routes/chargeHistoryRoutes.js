import express from "express";
import chargeHistoryController from "../controllers/chargeHistoryController.js";
import authentication from "../middleware/authentication.middleware.js";
import authorization from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post("/start/:station_id",authentication, chargeHistoryController.start);
router.post("/stop/:station_id",authentication, chargeHistoryController.stop);
router.get("/history/user/:station_id",authentication, chargeHistoryController.getHistoryUser);
router.get("/history/station",authentication,authorization.isAdmin('admin'), chargeHistoryController.getHistoryStation);


export default router;

import express from "express";

import {
  deleteNotification,
  getNotifications,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/notifications", getNotifications);
router.delete("/notifications/:id", deleteNotification);

export default router;
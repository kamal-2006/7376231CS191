import type { Request, Response } from "express";

import { Log } from "../utils/logger";

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

let notifications: Notification[] = [
  {
    id: 1,
    title: "Welcome",
    message: "Your notification service is running.",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Fetched notifications"
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await Log(
      "backend",
      "fatal",
      "controller",
      message
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification id",
      });
    }

    const existingCount = notifications.length;
    notifications = notifications.filter((item: Notification) => item.id !== id);

    if (notifications.length === existingCount) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await Log(
      "backend",
      "warn",
      "controller",
      `Deleted notification ${id}`
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await Log(
      "backend",
      "fatal",
      "controller",
      message
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
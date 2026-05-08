import { logger } from 'logging-middleware-package';
import notificationService from '../services/notificationService';

export async function createNotification(req: any, res: any) {
  try {
    await logger.info('controller', 'Creating notification');

    const { studentID, notificationType, placementType, message, priority } = req.body;

    if (!studentID || !notificationType || !placementType || !message) {
      await logger.warn('controller', 'Missing required fields for notification creation');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const notification = await notificationService.createNotification(
      studentID,
      notificationType,
      placementType,
      message,
      priority || 'medium'
    );

    await logger.info('controller', `Notification ${notification.id} created successfully`);

    res.json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    await logger.error('controller', `Create notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getStudentNotifications(req: any, res: any) {
  try {
    const { studentID } = req.params;
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');

    await logger.info('controller', `Fetching notifications for student ${studentID}`);

    const result = await notificationService.getStudentNotifications(studentID, page, pageSize);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    await logger.error('controller', `Get student notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getAllNotifications(req: any, res: any) {
  try {
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'DESC';

    await logger.info('controller', `Fetching all notifications (page ${page})`);

    const result = await notificationService.getAllNotifications(page, pageSize, sortBy, order);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    await logger.error('controller', `Get all notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getNotification(req: any, res: any) {
  try {
    const { id } = req.params;

    await logger.info('controller', `Fetching notification ${id}`);

    const notification = await notificationService.getNotification(id);

    if (!notification) {
      await logger.warn('controller', `Notification ${id} not found`);
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    await logger.error('controller', `Get notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function markAsRead(req: any, res: any) {
  try {
    const { id } = req.params;

    await logger.info('controller', `Marking notification ${id} as read`);

    const notification = await notificationService.markAsRead(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    await logger.error('controller', `Mark as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function deleteNotification(req: any, res: any) {
  try {
    const { id } = req.params;

    await logger.info('controller', `Deleting notification ${id}`);

    const result = await notificationService.deleteNotification(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await logger.info('controller', `Notification ${id} deleted successfully`);

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error: any) {
    await logger.error('controller', `Delete notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function notifyAllStudents(req: any, res: any) {
  try {
    const { notification_id, notification_type, notification_type_enum, placement_type_enum, message } = req.body;

    if (!notification_id || !notification_type || !placement_type_enum || !message) {
      await logger.warn('controller', 'Missing required fields for broadcast notification');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    await logger.info('controller', `Broadcasting notification ${notification_id} to all students`);

    const count = await notificationService.notifyAllStudents({
      notification_id,
      notification_type,
      notification_type_enum,
      placement_type_enum,
      message
    });

    await logger.info('controller', `Successfully notified ${count} students`);

    res.json({
      success: true,
      message: `Notification sent to ${count} students`,
      notified_count: count
    });
  } catch (error: any) {
    await logger.error('controller', `Notify all students error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getNotificationsByType(req: any, res: any) {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');

    await logger.info('controller', `Fetching notifications of type ${type}`);

    const result = await notificationService.getNotificationsByType(type, page, pageSize);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    await logger.error('controller', `Get notifications by type error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getNotificationsByPriority(req: any, res: any) {
  try {
    const { priority } = req.params;
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');

    await logger.info('controller', `Fetching ${priority} priority notifications`);

    const result = await notificationService.getNotificationsByPriority(priority, page, pageSize);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    await logger.error('controller', `Get notifications by priority error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function getUnreadCount(req: any, res: any) {
  try {
    const { studentID } = req.params;

    await logger.info('controller', `Fetching unread count for student ${studentID}`);

    const count = await notificationService.getUnreadCount(studentID);

    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error: any) {
    await logger.error('controller', `Get unread count error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function updateNotificationPriority(req: any, res: any) {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!priority) {
      await logger.warn('controller', 'Priority field is required');
      return res.status(400).json({
        success: false,
        error: 'Priority field is required'
      });
    }

    await logger.info('controller', `Updating notification ${id} priority to ${priority}`);

    const notification = await notificationService.updateNotificationPriority(id, priority);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error: any) {
    await logger.error('controller', `Update priority error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export async function initializeSampleData(req: any, res: any) {
  try {
    await logger.info('controller', 'Initializing sample data');

    await notificationService.initializeSampleData();

    await logger.info('controller', 'Sample data initialized successfully');

    res.json({
      success: true,
      message: 'Sample data initialized'
    });
  } catch (error: any) {
    await logger.error('controller', `Initialize sample data error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

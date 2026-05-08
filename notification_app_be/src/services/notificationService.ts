import { logger } from 'logging-middleware-package';
import * as db from '../utils/database';
import { INotification, NotifyAllStudentsRequest, PriorityNotificationRequest } from '../types/notification';

export class NotificationService {
  async createNotification(studentID: string, notificationType: string, placementType: string, message: string, priority: string = 'medium'): Promise<INotification> {
    await logger.debug('service', `Creating notification for student ${studentID}`);

    const notification = db.insertNotification({
      studentID,
      notificationType,
      placementType,
      message,
      priority: priority as 'low' | 'medium' | 'high',
      read: false
    });

    await logger.info('service', `Notification ${notification.id} created for student ${studentID}`);

    return notification;
  }

  async getStudentNotifications(studentID: string, page: number = 1, pageSize: number = 10): Promise<any> {
    await logger.debug('service', `Fetching notifications for student ${studentID}`);

    const skip = (page - 1) * pageSize;
    const result = db.getNotificationsByStudent(studentID, skip, pageSize);

    await logger.info('service', `Retrieved ${result.notifications.length} notifications for student ${studentID}`);

    return {
      notifications: result.notifications,
      total: result.total,
      page,
      pageSize,
      pages: Math.ceil(result.total / pageSize)
    };
  }

  async getAllNotifications(page: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', order: string = 'DESC'): Promise<any> {
    await logger.debug('service', `Fetching all notifications (page ${page})`);

    const skip = (page - 1) * pageSize;
    const result = db.getAllNotifications(skip, pageSize, sortBy, order);

    await logger.info('service', `Retrieved ${result.notifications.length} notifications (total: ${result.total})`);

    return {
      notifications: result.notifications,
      total: result.total,
      page,
      pageSize,
      pages: Math.ceil(result.total / pageSize)
    };
  }

  async getNotification(id: string): Promise<INotification | null> {
    await logger.debug('service', `Fetching notification ${id}`);

    const notification = db.getNotificationById(id);

    if (!notification) {
      await logger.warn('service', `Notification ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string): Promise<INotification | null> {
    await logger.debug('service', `Marking notification ${id} as read`);

    const notification = db.updateNotificationRead(id, true);

    if (notification) {
      await logger.info('service', `Notification ${id} marked as read`);
    }

    return notification;
  }

  async deleteNotification(id: string): Promise<boolean> {
    await logger.debug('service', `Deleting notification ${id}`);

    const result = db.deleteNotification(id);

    if (result) {
      await logger.info('service', `Notification ${id} deleted successfully`);
    }

    return result;
  }

  async notifyAllStudents(request: NotifyAllStudentsRequest): Promise<number> {
    await logger.info('service', `Broadcasting notification to all students`);

    const count = db.notifyAllStudents({
      notificationType: request.notification_type,
      placementType: request.placement_type_enum,
      message: request.message,
      priority: 'medium',
      read: false
    });

    await logger.info('service', `Notified ${count} students with notification ${request.notification_id}`);

    return count;
  }

  async getNotificationsByType(type: string, page: number = 1, pageSize: number = 10): Promise<any> {
    await logger.debug('service', `Fetching notifications of type ${type}`);

    const skip = (page - 1) * pageSize;
    const result = db.getNotificationsByType(type, skip, pageSize);

    await logger.info('service', `Retrieved ${result.notifications.length} notifications of type ${type}`);

    return {
      notifications: result.notifications,
      total: result.total,
      page,
      pageSize,
      pages: Math.ceil(result.total / pageSize)
    };
  }

  async getNotificationsByPriority(priority: string, page: number = 1, pageSize: number = 10): Promise<any> {
    await logger.debug('service', `Fetching ${priority} priority notifications`);

    const skip = (page - 1) * pageSize;
    const result = db.getNotificationsByPriority(priority, skip, pageSize);

    await logger.info('service', `Retrieved ${result.notifications.length} ${priority} priority notifications`);

    return {
      notifications: result.notifications,
      total: result.total,
      page,
      pageSize,
      pages: Math.ceil(result.total / pageSize)
    };
  }

  async getUnreadCount(studentID: string): Promise<number> {
    await logger.debug('service', `Fetching unread notification count for student ${studentID}`);

    const count = db.getUnreadNotifications(studentID);

    await logger.info('service', `Student ${studentID} has ${count} unread notifications`);

    return count;
  }

  async updateNotificationPriority(id: string, priority: string): Promise<INotification | null> {
    await logger.debug('service', `Updating notification ${id} priority to ${priority}`);

    const notification = await this.getNotification(id);

    if (!notification) {
      await logger.warn('service', `Cannot update priority: notification ${id} not found`);
      return null;
    }

    const updated = db.insertNotification({
      studentID: notification.studentID,
      notificationType: notification.notificationType,
      placementType: notification.placementType,
      message: notification.message,
      priority: priority as 'low' | 'medium' | 'high',
      read: notification.read
    });

    await logger.info('service', `Notification ${id} priority updated to ${priority}`);

    return updated;
  }

  async getStudentCount(): Promise<number> {
    return db.getStudentCount();
  }

  async initializeSampleData(): Promise<void> {
    await logger.info('service', 'Initializing sample data');

    for (let i = 1; i <= 50000; i++) {
      db.insertStudent(`STU${String(i).padStart(6, '0')}`, `student${i}@campus.edu`, `Student ${i}`);

      if (i % 5000 === 0) {
        await logger.info('service', `Initialized ${i} students`);
      }
    }

    await logger.info('service', 'Sample data initialization complete');
  }
}

export default new NotificationService();

/**
 * Example: Backend Service Usage
 * 
 * This example shows how to integrate the logger into a backend service
 * for business logic and data operations.
 */

import { logger } from '../src';

// Example: Notification Service
export class NotificationService {
  async sendNotification(userId: string, notificationData: any) {
    try {
      // Log the start of the operation
      await logger.info(
        'service',
        `Sending notification to user ${userId}`
      );

      // Simulate database query
      const user = await this.getUserFromDatabase(userId);

      if (!user) {
        await logger.warn(
          'service',
          `User ${userId} not found in database`
        );
        throw new Error('User not found');
      }

      // Log user details
      await logger.debug(
        'service',
        `Found user ${userId} with email ${user.email}`
      );

      // Send notification
      await this.sendEmail(user.email, notificationData);

      // Log success
      await logger.info(
        'service',
        `Notification sent successfully to user ${userId}`
      );

      return { success: true };
    } catch (error: any) {
      // Log the error
      await logger.error(
        'service',
        `Failed to send notification: ${error.message}`
      );
      throw error;
    }
  }

  async processNotificationBatch(userIds: string[]) {
    try {
      await logger.info(
        'service',
        `Processing batch of ${userIds.length} notifications`
      );

      for (const userId of userIds) {
        try {
          await this.sendNotification(userId, {
            title: 'Batch Notification',
          });
        } catch (error) {
          await logger.warn(
            'service',
            `Failed to process notification for user ${userId}`
          );
          // Continue processing other users
        }
      }

      await logger.info(
        'service',
        `Completed batch processing for ${userIds.length} users`
      );
    } catch (error: any) {
      await logger.fatal(
        'service',
        `Batch processing failed: ${error.message}`
      );
      throw error;
    }
  }

  async updateNotificationStatus(notificationId: string, status: string) {
    try {
      await logger.debug(
        'service',
        `Updating notification ${notificationId} to status ${status}`
      );

      // Database update
      const result = await this.updateInDatabase(notificationId, status);

      await logger.info(
        'service',
        `Notification ${notificationId} updated to ${status}`
      );

      return result;
    } catch (error: any) {
      await logger.error(
        'service',
        `Failed to update notification: ${error.message}`
      );
      throw error;
    }
  }

  private async getUserFromDatabase(userId: string): Promise<any> {
    // Mock implementation
    return { id: userId, email: 'user@example.com' };
  }

  private async sendEmail(email: string, data: any): Promise<void> {
    // Mock implementation
    return;
  }

  private async updateInDatabase(
    notificationId: string,
    status: string
  ): Promise<any> {
    // Mock implementation
    return { id: notificationId, status };
  }
}

// Usage in database layer
export class NotificationRepository {
  async findById(id: string) {
    try {
      await logger.debug('repository', `Querying notification ${id}`);

      // Mock database query
      const notification = { id, title: 'Test' };

      await logger.debug(
        'repository',
        `Found notification: ${JSON.stringify(notification)}`
      );

      return notification;
    } catch (error: any) {
      await logger.error(
        'repository',
        `Database query failed: ${error.message}`
      );
      throw error;
    }
  }

  async save(notification: any) {
    try {
      await logger.debug('repository', `Saving notification ${notification.id}`);

      // Mock database save
      await logger.info(
        'repository',
        `Notification ${notification.id} saved to database`
      );

      return notification;
    } catch (error: any) {
      await logger.error(
        'repository',
        `Failed to save notification: ${error.message}`
      );
      throw error;
    }
  }
}

// Usage in middleware
export async function notificationMiddleware(req: any, res: any, next: any) {
  try {
    await logger.debug(
      'middleware',
      `Processing ${req.method} ${req.path}`
    );
    next();
  } catch (error: any) {
    await logger.error(
      'middleware',
      `Middleware error: ${error.message}`
    );
    res.status(500).json({ error: 'Internal server error' });
  }
}

import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';

const router = Router();

router.post('/', notificationController.createNotification);

router.get('/', notificationController.getAllNotifications);

router.get('/student/:studentID', notificationController.getStudentNotifications);

router.get('/single/:id', notificationController.getNotification);

router.patch('/:id/read', notificationController.markAsRead);

router.patch('/:id/priority', notificationController.updateNotificationPriority);

router.delete('/:id', notificationController.deleteNotification);

router.post('/broadcast/all', notificationController.notifyAllStudents);

router.get('/type/:type', notificationController.getNotificationsByType);

router.get('/priority/:priority', notificationController.getNotificationsByPriority);

router.get('/student/:studentID/unread', notificationController.getUnreadCount);

router.post('/init/sample-data', notificationController.initializeSampleData);

export default router;

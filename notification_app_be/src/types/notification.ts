import { Database } from 'better-sqlite3';

export interface INotification {
  id: string;
  studentID: string;
  notificationType: string;
  placementType: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStudent {
  studentID: string;
  email: string;
  name: string;
}

export interface NotificationQuery {
  skip: number;
  limit: number;
  sort: string;
  filter?: string;
}

export interface NotificationResponse {
  notifications: INotification[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NotifyAllStudentsRequest {
  notification_id: string;
  notification_type: string;
  notification_type_enum: string;
  placement_type_enum: string;
  message: string;
}

export interface NotifyAllStudentsResponse {
  success: boolean;
  message: string;
  notified_count: number;
}

export interface PriorityNotificationRequest {
  notification_id: string;
  priority: string;
  message: string;
}

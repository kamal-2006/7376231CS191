import Database from 'better-sqlite3';
import path from 'path';
import { INotification, IStudent } from '../types/notification';

const dbPath = path.join(__dirname, '../../notifications.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      studentID TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      studentID TEXT NOT NULL,
      notificationType TEXT NOT NULL,
      placementType TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      read INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentID) REFERENCES students(studentID)
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_studentID ON notifications(studentID);
    CREATE INDEX IF NOT EXISTS idx_notifications_createdAt ON notifications(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
  `);
}

export function insertNotification(notification: Omit<INotification, 'id' | 'createdAt' | 'updatedAt'>): INotification {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO notifications (id, studentID, notificationType, placementType, message, priority, read, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, notification.studentID, notification.notificationType, notification.placementType, notification.message, notification.priority, notification.read ? 1 : 0, now, now);

  return {
    id,
    ...notification,
    createdAt: now,
    updatedAt: now
  };
}

export function getNotificationsByStudent(studentID: string, skip: number = 0, limit: number = 10): { notifications: INotification[], total: number } {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE studentID = ?');
  const count = (countStmt.get(studentID) as any).count;

  const stmt = db.prepare(`
    SELECT id, studentID, notificationType, placementType, message, priority, read, createdAt, updatedAt
    FROM notifications
    WHERE studentID = ?
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  const notifications = stmt.all(studentID, limit, skip) as any[];

  return {
    notifications: notifications.map(n => ({
      ...n,
      read: Boolean(n.read)
    })),
    total: count
  };
}

export function getNotificationById(id: string): INotification | null {
  const stmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
  const notification = stmt.get(id) as any;

  if (!notification) return null;

  return {
    ...notification,
    read: Boolean(notification.read)
  };
}

export function updateNotificationRead(id: string, read: boolean): INotification | null {
  const now = new Date().toISOString();
  const stmt = db.prepare('UPDATE notifications SET read = ?, updatedAt = ? WHERE id = ?');

  stmt.run(read ? 1 : 0, now, id);

  return getNotificationById(id);
}

export function deleteNotification(id: string): boolean {
  const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
  const result = stmt.run(id);

  return (result.changes || 0) > 0;
}

export function getAllNotifications(skip: number = 0, limit: number = 10, sortBy: string = 'createdAt', order: string = 'DESC'): { notifications: INotification[], total: number } {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM notifications');
  const count = (countStmt.get() as any).count;

  const stmt = db.prepare(`
    SELECT id, studentID, notificationType, placementType, message, priority, read, createdAt, updatedAt
    FROM notifications
    ORDER BY ${sortBy} ${order}
    LIMIT ? OFFSET ?
  `);

  const notifications = stmt.all(limit, skip) as any[];

  return {
    notifications: notifications.map(n => ({
      ...n,
      read: Boolean(n.read)
    })),
    total: count
  };
}

export function insertStudent(studentID: string, email: string, name: string): IStudent {
  const stmt = db.prepare('INSERT OR IGNORE INTO students (studentID, email, name) VALUES (?, ?, ?)');

  stmt.run(studentID, email, name);

  return { studentID, email, name };
}

export function getAllStudents(): IStudent[] {
  const stmt = db.prepare('SELECT studentID, email, name FROM students');
  return stmt.all() as IStudent[];
}

export function getStudentCount(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM students');
  return ((stmt.get() as any).count || 0);
}

export function notifyAllStudents(notification: Omit<INotification, 'id' | 'studentID' | 'createdAt' | 'updatedAt'>): number {
  const students = getAllStudents();
  let count = 0;

  for (const student of students) {
    try {
      insertNotification({
        ...notification,
        studentID: student.studentID
      });
      count++;
    } catch (error) {
      console.error(`Failed to notify student ${student.studentID}:`, error);
    }
  }

  return count;
}

export function getNotificationsByType(type: string, skip: number = 0, limit: number = 10) {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE notificationType = ?');
  const count = (countStmt.get(type) as any).count;

  const stmt = db.prepare(`
    SELECT id, studentID, notificationType, placementType, message, priority, read, createdAt, updatedAt
    FROM notifications
    WHERE notificationType = ?
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  const notifications = stmt.all(type, limit, skip) as any[];

  return {
    notifications: notifications.map(n => ({
      ...n,
      read: Boolean(n.read)
    })),
    total: count
  };
}

export function getNotificationsByPriority(priority: string, skip: number = 0, limit: number = 10) {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE priority = ?');
  const count = (countStmt.get(priority) as any).count;

  const stmt = db.prepare(`
    SELECT id, studentID, notificationType, placementType, message, priority, read, createdAt, updatedAt
    FROM notifications
    WHERE priority = ?
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);

  const notifications = stmt.all(priority, limit, skip) as any[];

  return {
    notifications: notifications.map(n => ({
      ...n,
      read: Boolean(n.read)
    })),
    total: count
  };
}

export function getUnreadNotifications(studentID: string): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE studentID = ? AND read = 0');
  return ((stmt.get(studentID) as any).count || 0);
}

export default db;

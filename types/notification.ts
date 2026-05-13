import { NotificationEntityType, NotificationType } from "@/types/enums";

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  entityType: NotificationEntityType | null;
  entityId: string | null;
  createdAt: string;
  userId: string;
  orgId: string;
}

export interface SportsGroup {
  id: number; // Primary key, auto-incrementing
  title: string; // Title of the sports group
  statusHotest: number; // Status indicating if it's one of the hottest groups (integer)
  status: number; // Status (e.g., active, inactive)
  imageUrl: string; // URL for the group's image
  createdAt: Date; // Timestamp for when the group was created
  createdBy?: number | null; // ID of the user who created the group (optional, default null)
  updatedAt?: Date | null; // Timestamp for when the group was last updated (optional, default null)
  updatedBy?: number | null; // ID of the user who last updated the group (optional, default null)
  statusDeleted?: number; // Status indicating if the group is deleted (default 0)
}

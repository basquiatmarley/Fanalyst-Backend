import type { SportsGroup } from "./SportsGroup";

export interface Club {
  id: number; // Primary key
  sportsGroupId: number; // Foreign key to a sports group
  name: string; // Club name (unique)
  status: number; // Status as an integer (2)
  imageUrl: string; // URL for the club's image
  createdAt: Date; // Timestamp for when the club was created
  createdBy?: number | null; // ID of the user who created the club (optional, default null)
  updatedAt?: Date | null; // Timestamp for when the club was last updated (optional, default null)
  updatedBy?: number | null; // ID of the user who last updated the club (optional, default null)
  statusDeleted?: number; // Status indicating if the club is deleted (default 0)
  sportsGroup?: SportsGroup;
}

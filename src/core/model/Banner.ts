import type { SportsGroup } from "./SportsGroup";

export interface Banner {
  id: number; // Primary key
  name: string; //  name (unique)
  route?: string; //  name (unique)
  status: number; // Status as an integer (2)
  imageUrl: string; // URL for the banner's image
  createdAt: Date; // Timestamp for when the banner was created
  createdBy?: number | null; // ID of the user who created the banner (optional, default null)
  updatedAt?: Date | null; // Timestamp for when the banner was last updated (optional, default null)
  updatedBy?: number | null; // ID of the user who last updated the banner (optional, default null)
  statusDeleted?: number; // Status indicating if the banner is deleted (default 0)
}

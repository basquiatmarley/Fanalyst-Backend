import type { SportsGroup } from "./SportsGroup";

export interface Sport {
    id: number; // Primary key
    sportsGroupId: number; // Foreign key to a sports group
    key: string; // Unique key
    title: string; // Title of the sport
    status: number; // Status (usually a code indicating active/inactive)
    imageUrl?: string; // Optional field for an image URL
    createdAt: Date; // Timestamp for creation
    createdBy?: number | null; // ID of the user who created it
    updatedAt?: Date | null; // Timestamp for the last update
    updatedBy?: number | null; // ID of the user who updated it
    statusDeleted?: number; // Flag for soft deletion
    sportsGroup? : SportsGroup | null;  
  }
  
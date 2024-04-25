export interface UsersComment {
    id: number; // Primary key, auto-incremented
    eventId: string; // Reference to an event
    title: string; // Title of the comment
    description?: string | null; // Optional, text description
    createdAt: Date; // Timestamp for creation
    createdBy?: number | null; // Optional, who created the record
    updatedAt?: Date | null; // Optional, when it was last updated
    updatedBy?: number | null; // Optional, who updated the record
    statusDeleted?: number; // Soft-deletion flag
    lft?: number | null; // Optional, left position (for nesting comments)
    rght?: number | null; // Optional, right position (for nesting comments)
  }
  
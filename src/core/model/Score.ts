export interface Score {
    id: number; // Primary key, auto-incremented
    eventId: string; // Reference to an event
    completed: number; // Status indicating if the score is complete
    homeScore: number; // Home team score
    awayScore: number; // Away team score
    createdAt: Date; // Timestamp for creation
    createdBy?: number | null; // Optional, who created the record
    updatedAt?: Date | null; // Optional, when it was last updated
    updatedBy?: number | null; // Optional, who updated the record
    statusDeleted?: number; // Soft-deletion flag
  }
  
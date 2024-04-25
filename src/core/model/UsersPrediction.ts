export interface UsersPrediction {
  id: number; // Primary key, auto-incremented
  eventId: string; // Reference to an event
  predictedTeam: number; // Identifier for the predicted team
  predictedStatus: number; // Status of the prediction
  createdAt: Date; // Timestamp for creation
  createdBy?: number | null; // Optional, who created the record
  updatedAt?: Date | null; // Optional, when it was last updated
  updatedBy?: number | null; // Optional, who updated the record
  statusDeleted?: number; // Soft-deletion flag
}

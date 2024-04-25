export interface Odds {
  id: number; // Primary key, auto-incremented
  eventId: string; // Reference to an event
  bookmakerKey: string; // Identifier for the bookmaker
  bookmakerTitle: string; // Descriptive title for the bookmaker
  marketsKey: string; // Identifier for the market
  oddsHomePoint: number; // Home point odds
  oddsAwayPoint: number; // Away point odds
  oddsHomePrice: number; // Price for the home odds
  oddsAwayPrice: number; // Price for the away odds
  createdAt: Date; // Timestamp for creation
  createdBy?: number | null; // Optional, who created the record
  updatedAt?: Date | null; // Optional, when it was last updated
  updatedBy?: number | null; // Optional, who updated the record
  statusDeleted?: number; // Soft-deletion flag
}

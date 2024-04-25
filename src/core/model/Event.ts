import type { Club } from "./Club";
import type { SportsGroup } from "./SportsGroup";
import type { Sport } from "./Sport";
import type { Odds } from "./Odd";
import type { UsersComment } from "./UsersComment";
import type { UsersPrediction } from "./UsersPrediction";
import type { Score } from "./Score";

export interface Event {
  id: string; // Primary key, VARCHAR
  sportsGroupId: number; // Reference to sports group
  sportId: number; // Reference to sport
  homeClubId: number; // Reference to home club
  awayClubId: number; // Reference to away club
  commenceTime: Date; // Event start time
  winner?: number; // Winner ID (optional, as it might not be decided yet)
  completed?: number; // Status indicating if event is completed
  status: number; // General status (active, inactive, etc.)
  createdAt: Date; // Timestamp for when the event was created
  createdBy?: number | null; // ID of the user who created it (can be null)
  updatedAt?: Date | null; // Timestamp for the last update (can be null)
  updatedBy?: number | null; // ID of the user who updated it (can be null)
  statusDeleted?: number; // Soft-deletion flag
  homeClub?: Club | null;
  awayClub?: Club | null;
  sportsGroup?: SportsGroup | null;
  sport?: Sport | null;
  odds?: Odds[] | null;
  usersComments?: UsersComment[] | null;
  usersPredictions?: UsersPrediction[] | null;
  scores?: Score[] | null;
}

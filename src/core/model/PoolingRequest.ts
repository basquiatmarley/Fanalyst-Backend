export interface PoolingRequest {
    id: number; // Primary key, auto-incremented
    type: string; // Type of the request
    urlRequest: string; // URL for the request
    response: string; // Response from the request
    request: string; // The original request content
    createdAt: Date; // Timestamp for creation
    createdBy?: number | null; // Optional, who created the record
    updatedAt?: Date | null; // Optional, when it was last updated
    updatedBy?: number | null; // Optional, who updated the record
    statusDeleted?: number; // Soft-deletion flag
  }
  
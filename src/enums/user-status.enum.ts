export enum UserStatus {
  ACTIVE               = 'ACTIVE',
  INACTIVE             = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  BANNED               = 'BANNED',
}

/** What the frontend filter control sends */
export type UserStatusFilter = 'active' | 'inactive' | 'pending' | 'banned';
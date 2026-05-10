import { UserStatus } from '../enums/user-status.enum';

interface UserStatusFlags {
  isDisabled: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
}

/**
 * Derives a single semantic status from the four boolean flag columns.
 *
 * Priority order:
 *   1. isDisabled        → BANNED               (administrative block, wins over everything)
 *   2. !email/phone verified → PENDING_VERIFICATION (account not yet confirmed)
 *   3. !isActive         → INACTIVE              (account exists but deactivated)
 *   4. fallthrough       → ACTIVE
 */
export function deriveUserStatus(flags: UserStatusFlags): UserStatus {
  if (flags.isDisabled)                                       return UserStatus.BANNED;
  if (!flags.isEmailVerified || !flags.isPhoneVerified)       return UserStatus.PENDING_VERIFICATION;
  if (!flags.isActive)                                        return UserStatus.INACTIVE;
  return UserStatus.ACTIVE;
}
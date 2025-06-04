import { User } from '../users/user';

export interface EventSettlements {
  user: User;
  settlement: Settlements;
}

export interface Settlements {
  eventCurrency: number;
  userCurrency: number;
}

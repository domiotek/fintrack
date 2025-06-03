import { User } from '../users/user';

export interface EventBill {
  id: number;
  name: string;
  date: string;
  paidBy: User;
  eventCurrency: EventCurrency;
  userCurrency: EventCurrency;
}

export interface EventCurrency {
  totalSum: number;
  costPerUser: number;
}

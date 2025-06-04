import { User } from '../user/user.model';

export interface Participant extends User {
  lastSeenAt: string;
}

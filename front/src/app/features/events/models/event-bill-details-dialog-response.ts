import { UpdateEventRequest } from '../../../core/models/events/update-event-request';

export interface EventBillDetailsDialogResponse {
  type: 'edit' | 'delete';
  bill: UpdateEventRequest | null;
}

import { UpdateEventBillRequest } from '../../../core/models/events/update-event-bill-request';

export interface EventBillDetailsDialogResponse {
  type: 'edit' | 'delete';
  bill: UpdateEventBillRequest | null;
}

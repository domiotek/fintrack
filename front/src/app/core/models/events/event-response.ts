import { PaginationResponse } from '../pagination/pagination-response';
import { Event } from './event';

export interface EventResponse {
  content: Event[];
  page: PaginationResponse;
}

import { SortState } from '../../../core/models/sort/sort-state';
import { CATEGORIES_SORT_ITEMS } from './categories-sort-items';

export const CATEGORIES_START_SORT_STATE: SortState = {
  value: CATEGORIES_SORT_ITEMS[0].value,
  direction: 'ASC',
};

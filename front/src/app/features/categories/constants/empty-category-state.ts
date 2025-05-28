import { DateTime } from 'luxon';
import { ICategoryState } from '../models/category-state';

export const EMPTY_CATEGORY_STATE: ICategoryState = {
  timeRange: {
    from: DateTime.now().startOf('month'),
    to: DateTime.now().endOf('month'),
  },
};

import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { DEFAULT_CHAT_ACTIVITY_THRESHOLD } from '../controls/chat/constants/chat.const';

@Pipe({
  name: 'activityText',
  pure: true,
})
export class ActivityTextPipe implements PipeTransform {
  transform(dateTime: DateTime | null): string {
    if (!dateTime?.isValid) {
      return '';
    }

    const diffInMinutes = Math.abs(dateTime.diffNow('minutes').minutes);

    return diffInMinutes < DEFAULT_CHAT_ACTIVITY_THRESHOLD ? 'teraz' : (dateTime.toRelative({ style: 'long' }) ?? '');
  }
}

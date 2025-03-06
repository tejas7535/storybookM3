import { Pipe, PipeTransform } from '@angular/core';

import { Approver } from '@gq/shared/models';

@Pipe({
  name: 'userInitialLetters',
  standalone: false,
})
export class UserInitialLettersPipe implements PipeTransform {
  transform(user: Approver): string {
    if (!user) {
      return '';
    }

    return `${user?.firstName?.at(0) ?? ''}${user?.lastName?.at(0) ?? ''}`;
  }
}

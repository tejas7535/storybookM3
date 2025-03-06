import { Pipe, PipeTransform } from '@angular/core';

import { Keyboard } from '@gq/shared/models';

import { MrpData } from '../../models/quotation-detail/mrp-data.model';

@Pipe({
  name: 'mrpDisplay',
  standalone: false,
})
export class MrpDisplayPipe implements PipeTransform {
  transform(mrpData: MrpData): string {
    if (mrpData) {
      return `${mrpData.mrpController} | ${mrpData.mrpControllerName}`;
    }

    return Keyboard.DASH;
  }
}

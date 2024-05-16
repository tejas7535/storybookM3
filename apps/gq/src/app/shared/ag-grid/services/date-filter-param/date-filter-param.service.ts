import { inject, Injectable } from '@angular/core';

import { timestampRegex } from '@gq/shared/constants';

import { SET_COLUMN_FILTER, TEXT_COLUMN_FILTER } from '../../constants/filters';
import { ColumnUtilityService } from '../column-utility.service';
import { ComparatorService } from '../comparator.service';

@Injectable({
  providedIn: 'root',
})
export class DateFilterParamService {
  private readonly columnUtilityService = inject(ColumnUtilityService);
  private readonly comparatorService = inject(ComparatorService);

  DATE_FILTER_PARAMS = {
    filters: [
      {
        filter: TEXT_COLUMN_FILTER,
        filterParams: {
          defaultOption: 'startsWith',
          suppressAndOrCondition: true,
          buttons: ['reset'],
          textFormatter: (val: string) => {
            if (timestampRegex.test(val)) {
              return this.columnUtilityService.dateFormatter(val);
            }

            return val;
          },
        },
      },
      {
        filter: SET_COLUMN_FILTER,
        filterParams: {
          comparator: this.comparatorService.compareTranslocoDateDesc,
        },
      },
    ],
  };
}

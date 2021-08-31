import { RowDataChangedEvent } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../../shared/autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../../../shared/date-input/date-input.module';
import { TimePeriod } from '../../../shared/models';
import { SelectInputModule } from '../../../shared/select-input/select-input.module';
import { getTimeRangeHint } from '../../../shared/utils/utilities';
import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

jest.mock('../../../shared/utils/utilities', () => ({
  getTimeRangeHint: jest.fn(() => 'test'),
}));

describe('ReasonsForLeavingTableComponent', () => {
  let component: ReasonsForLeavingTableComponent;
  let spectator: Spectator<ReasonsForLeavingTableComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingTableComponent,
    imports: [
      AgGridModule.withComponents([]),
      provideTranslocoTestingModule({ en: {} }),
      AutocompleteInputModule,
      SelectInputModule,
      DateInputModule,
    ],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedTimePeriod', () => {
    test('should set period and call getTImeRangeHint', () => {
      const period = TimePeriod.LAST_12_MONTHS;

      component.selectedTimePeriod = period;

      expect(component.selectedTimePeriod).toEqual(period);
      expect(getTimeRangeHint).toHaveBeenCalledWith(period);
    });
  });

  describe('ngOnInit', () => {
    test('should set columnDefs', () => {
      component.columnDefs = [];

      component.ngOnInit();

      expect(component.columnDefs.length).toEqual(4);
    });
  });

  describe('onRowDataChanged', () => {
    test('should autosize detailedReason column', () => {
      const params = {
        columnApi: {
          autoSizeColumns: jest.fn(),
        },
      } as unknown as RowDataChangedEvent;

      component.onRowDataChanged(params);

      expect(params.columnApi.autoSizeColumns).toHaveBeenCalledWith(
        ['detailedReason'],
        false
      );
    });
  });
});

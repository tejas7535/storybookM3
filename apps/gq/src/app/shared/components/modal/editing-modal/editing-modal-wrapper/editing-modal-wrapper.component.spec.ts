import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { KpiDisplayValue } from '../models/kpi-value.model';
import { EditingModalWrapperComponent } from './editing-modal-wrapper.component';

describe('EditingModalWrapperComponent', () => {
  let component: EditingModalWrapperComponent;
  let spectator: Spectator<EditingModalWrapperComponent>;

  const createComponent = createComponentFactory({
    component: EditingModalWrapperComponent,
    detectChanges: false,
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          quotationDetail: QUOTATION_DETAIL_MOCK,
          field: ColumnFields.DISCOUNT,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getKpiForTargetPrice', () => {
    test('should provide the KpiDisplayValue Object from the inputs', () => {
      const result = component.getKpiForTargetPrice(
        QUOTATION_DETAIL_MOCK,
        new FormControl(TargetPriceSource.CUSTOMER)
      );
      expect(result).toEqual({
        displayValue: 'translate it',
        value: 0,
        previousDisplayValue: 'translate it',
        key: ColumnFields.TARGET_PRICE_SOURCE,
      } as KpiDisplayValue);
    });
  });
});

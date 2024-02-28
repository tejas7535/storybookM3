import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks';
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
});

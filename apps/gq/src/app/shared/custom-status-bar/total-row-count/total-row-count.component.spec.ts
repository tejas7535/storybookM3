import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';

import { TotalRowCountComponent } from './total-row-count.component';

describe('TotalRowCountComponent', () => {
  let component: TotalRowCountComponent;
  let spectator: Spectator<TotalRowCountComponent>;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: TotalRowCountComponent,
    declarations: [TotalRowCountComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn().mockReturnValue([QUOTATION_DETAIL_MOCK]),
        forEachLeafNode: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(component.totalNetValue).toEqual(0);
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.selectedMargin).toEqual(89654);
      expect(component.selectedNetValue).toEqual(26.67);
      expect(component.selectedRsp).toEqual(845.76);
    });
  });
});

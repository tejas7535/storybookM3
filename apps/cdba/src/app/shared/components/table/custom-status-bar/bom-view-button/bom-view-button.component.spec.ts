import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BomViewButtonComponent } from './bom-view-button.component';

describe('BomViewButtonComponent', () => {
  let spectator: Spectator<BomViewButtonComponent>;
  let component: BomViewButtonComponent;

  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: BomViewButtonComponent,
    imports: [
      MatButtonModule,
      RouterTestingModule.withRoutes([]),
      provideTranslocoTestingModule({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(3);
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onCustomSetSelection', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onCustomSetSelection();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });
});

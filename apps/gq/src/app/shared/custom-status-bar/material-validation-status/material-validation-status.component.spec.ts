import { IStatusPanelParams, RowNode } from '@ag-grid-community/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { MaterialValidationStatusComponent } from './material-validation-status.component';

describe('MaterialValidationStatusComponent', () => {
  let component: MaterialValidationStatusComponent;
  let spectator: Spectator<MaterialValidationStatusComponent>;

  const createComponent = createComponentFactory({
    component: MaterialValidationStatusComponent,
    declarations: [MaterialValidationStatusComponent],
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add event listener', () => {
      const params = {
        api: {
          addEventListener: jest.fn(),
        },
      } as unknown as IStatusPanelParams;

      component.agInit(params);

      expect(component['params']).toEqual(params);
      expect(params.api.addEventListener).toHaveBeenCalledWith(
        'rowDataChanged',
        expect.any(Function)
      );
    });
  });

  describe('rowValueChanges', () => {
    test('should count invalid and total combinations correctly', () => {
      const nodes: RowNode[] = [
        {
          data: {
            materialNumber: '123',
            quantity: 5,
            info: {
              valid: true,
            },
          },
        } as unknown as RowNode,
        {
          data: {
            materialNumber: '1234',
            quantity: 55,
            info: {
              valid: true,
            },
          },
        } as unknown as RowNode,
        {
          data: {
            materialNumber: '12356',
            quantity: 2,
            info: {
              valid: true,
            },
          },
        } as unknown as RowNode,
        {
          data: {
            materialNumber: '777',
            quantity: 12,
            info: {
              valid: false,
            },
          },
        } as unknown as RowNode,
      ];

      const params = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            nodes.forEach((element) => {
              callback(element);
            }),
        },
      } as unknown as IStatusPanelParams;

      component['params'] = params;

      component.rowValueChanges();

      expect(component.invalid).toEqual(1);
      expect(component.combinations).toEqual(nodes.length);
    });
  });
});

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ValueFormatterFunc, ValueFormatterParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '../../shared/shared.module';
import { ResignationsComponent } from './resignations.component';

import SpyInstance = jest.SpyInstance;

describe('ResignationsComponent', () => {
  let component: ResignationsComponent;
  let spectator: Spectator<ResignationsComponent>;

  const createComponent = createComponentFactory({
    component: ResignationsComponent,
    detectChanges: false,
    imports: [SharedModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('defaultColDef', () => {
    test('should set options', () => {
      const getHeaderClass: any = component.defaultColDef
        .headerClass as unknown;
      expect(component.defaultColDef.sortable).toBeTruthy();
      expect(getHeaderClass()).toEqual('bg-selected-overlay');
    });
  });

  describe('columnDefs', () => {
    const expectedDate = '01/01/1970';
    let mockDate: SpyInstance;

    beforeAll(() => {
      mockDate = jest
        .spyOn(Date.prototype, 'toLocaleDateString')
        .mockReturnValue(expectedDate);
    });

    afterAll(() => {
      mockDate.mockRestore();
    });

    test('should set col defs and correct value formatters', () => {
      const formatter: ValueFormatterFunc = component.columnDefs[0]
        .valueFormatter as ValueFormatterFunc;

      expect(component.columnDefs.length).toEqual(2);
      expect(
        formatter({ data: { exitDate: '123321' } } as ValueFormatterParams)
      ).toEqual(expectedDate);
      expect(
        formatter({ data: { exitDate: undefined } } as ValueFormatterParams)
      ).toEqual('');
    });
  });
});

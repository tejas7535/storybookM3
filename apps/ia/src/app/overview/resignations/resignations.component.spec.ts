import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ValueGetterFunc, ValueGetterParams } from 'ag-grid-community';

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
    const expectedDate = '1/01/1970';
    let mockDate: SpyInstance;

    beforeAll(() => {
      mockDate = jest
        .spyOn(Date.prototype, 'toLocaleDateString')
        .mockReturnValue(expectedDate);
    });

    afterAll(() => {
      mockDate.mockRestore();
    });

    test('should set col defs and correct value getters', () => {
      const getter: ValueGetterFunc = component.columnDefs[0]
        .valueGetter as ValueGetterFunc;

      expect(component.columnDefs.length).toEqual(2);
      expect(
        getter({ data: { exitDate: '123321' } } as ValueGetterParams)
      ).toEqual(expectedDate);
      expect(
        getter({ data: { exitDate: undefined } } as ValueGetterParams)
      ).toEqual('');
    });
  });
});

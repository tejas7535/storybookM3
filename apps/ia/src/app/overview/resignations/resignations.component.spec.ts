import { createComponentFactory, Spectator } from '@ngneat/spectator';

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

    test('should set col defs and correct formatters', () => {
      const formatter: any = component.columnDefs[0].valueFormatter as unknown;

      expect(component.columnDefs.length).toEqual(2);
      expect(formatter({ value: '123321' })).toEqual(expectedDate);
      expect(formatter({ value: undefined })).toEqual('');
    });
  });
});

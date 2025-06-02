import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../test/stub.class';
import { AbstractBaseCellRendererComponent } from './abstract-cell-renderer.component';

class TestCellRendererComponent extends AbstractBaseCellRendererComponent<string> {
  protected setValue(parameters: ICellRendererParams<any, string>): void {
    this.value = parameters.value;
  }
}

describe('AbstractBaseCellRendererComponent', () => {
  let component: TestCellRendererComponent;

  beforeEach(() => {
    component = Stub.get<TestCellRendererComponent>({
      component: TestCellRendererComponent,
    });
  });

  describe('agInit', () => {
    it('should initialize parameters and refData, and call setValue', () => {
      const mockParams: ICellRendererParams<any, string> = {
        value: 'Test Value',
        colDef: { refData: { key: 'value' } },
      } as any;

      const setValueSpy = jest.spyOn(component as any, 'setValue');

      component.agInit(mockParams);

      expect(component['parameters']).toEqual(mockParams);
      expect(component['refData']).toEqual({ key: 'value' });
      expect(setValueSpy).toHaveBeenCalledWith(mockParams);
    });

    it('should set refData to an empty object if colDef.refData is undefined', () => {
      const mockParams: ICellRendererParams<any, string> = {
        value: 'Test Value',
        colDef: undefined,
      } as any;

      component.agInit(mockParams);

      expect(component['refData']).toEqual({});
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('setValue', () => {
    it('should set the value property', () => {
      const mockParams: ICellRendererParams<any, string> = {
        value: 'Test Value',
      } as any;

      component.agInit(mockParams);

      expect(component.value).toBe('Test Value');
    });
  });
});

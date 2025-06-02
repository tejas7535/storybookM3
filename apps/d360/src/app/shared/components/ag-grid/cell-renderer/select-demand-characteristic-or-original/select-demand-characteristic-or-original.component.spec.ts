import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../test/stub.class';
import * as parseValuesModule from '../../../../utils/parse-values';
import { SelectDemandCharacteristicOrOriginalCellRendererComponent } from './select-demand-characteristic-or-original.component';

describe('SelectValueOrOriginalCellRendererComponent', () => {
  let component: SelectDemandCharacteristicOrOriginalCellRendererComponent;

  beforeEach(() => {
    component =
      Stub.get<SelectDemandCharacteristicOrOriginalCellRendererComponent>({
        component: SelectDemandCharacteristicOrOriginalCellRendererComponent,
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setValue', () => {
    it('should set value correctly when params.value is truthy', () => {
      const mockParams: ICellRendererParams = {
        value: 'MOCK_VALUE',
      } as any;

      jest
        .spyOn(parseValuesModule, 'parseDemandCharacteristicIfPossible')
        .mockReturnValue('PARSED_VALUE');

      component['setValue'](mockParams);

      expect(component['value']).toEqual('');
    });

    it('should set value correctly when params.value is falsy', () => {
      const mockParams: ICellRendererParams = {
        value: undefined,
      } as any;

      component['setValue'](mockParams);

      expect(component['value']).toBeNull();
    });
  });
});

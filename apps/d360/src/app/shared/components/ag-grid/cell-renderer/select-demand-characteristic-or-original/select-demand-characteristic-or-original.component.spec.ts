import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import * as parseValuesModule from '../../../../utils/parse-values';
import { SelectDemandCharacteristicOrOriginalCellRendererComponent } from './select-demand-characteristic-or-original.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

describe('SelectValueOrOriginalCellRendererComponent', () => {
  let spectator: Spectator<SelectDemandCharacteristicOrOriginalCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: SelectDemandCharacteristicOrOriginalCellRendererComponent,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('setValue', () => {
    it('should set value correctly when params.value is truthy', () => {
      const mockParams: ICellRendererParams = {
        value: 'MOCK_VALUE',
      } as any;

      jest
        .spyOn(parseValuesModule, 'parseDemandCharacteristicIfPossible')
        .mockReturnValue('PARSED_VALUE');

      spectator.component['setValue'](mockParams);

      expect(spectator.component['value']).toEqual(
        'field.demandCharacteristic.value.PARSED_VALUE mocked'
      );
    });

    it('should set value correctly when params.value is falsy', () => {
      const mockParams: ICellRendererParams = {
        value: undefined,
      } as any;

      spectator.component['setValue'](mockParams);

      expect(spectator.component['value']).toBeNull();
    });
  });
});

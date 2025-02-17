import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import * as selectableValuesUtilsModule from '../../../inputs/autocomplete/selectable-values.utils';
import * as displayFunctionsModule from '../../../inputs/display-functions.utils';
import { SelectableValueOrOriginalCellRendererComponent } from './selectable-value-or-original.component';

describe('SelectableValueOrOriginalCellRendererComponent', () => {
  let spectator: Spectator<SelectableValueOrOriginalCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: SelectableValueOrOriginalCellRendererComponent,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('setValue', () => {
    it('should set value correctly when foundValue exists', () => {
      const mockParams: ICellRendererParams & {
        options: selectableValuesUtilsModule.SelectableValue[];
        getLabel?: (v: selectableValuesUtilsModule.SelectableValue) => string;
      } = {
        value: '1',
        options: [{ id: '1', text: 'Option 1' }],
      } as any;

      spectator.component['setValue'](mockParams);

      expect(spectator.component['value']).toEqual('1 - Option 1');
    });

    it('should set value correctly when foundValue does not exist but params.value is SelectableValue', () => {
      const mockParams: ICellRendererParams & {
        options?: selectableValuesUtilsModule.SelectableValue[];
        getLabel?: (v: selectableValuesUtilsModule.SelectableValue) => string;
      } = {
        value: { id: 1, text: 'Option 1' },
      } as any;

      jest
        .spyOn(displayFunctionsModule.DisplayFunctions, 'displayFnId')
        .mockReturnValue('DISPLAYED_VALUE');
      jest
        .spyOn(
          selectableValuesUtilsModule.SelectableValueUtils,
          'isSelectableValue'
        )
        .mockReturnValue(true);

      spectator.component['setValue'](mockParams as any);

      expect(spectator.component['value']).toEqual('1 - Option 1');
    });

    it('should set value correctly when foundValue does not exist and params.value is not SelectableValue', () => {
      const mockParams: ICellRendererParams & {
        options?: selectableValuesUtilsModule.SelectableValue[];
        getLabel?: (v: selectableValuesUtilsModule.SelectableValue) => string;
      } = {
        value: 'MOCK_VALUE',
      } as any;

      jest
        .spyOn(displayFunctionsModule.DisplayFunctions, 'displayFnId')
        .mockReturnValue('DISPLAYED_VALUE');

      spectator.component['setValue'](mockParams as any);

      expect(spectator.component['value']).toEqual('DISPLAYED_VALUE');
    });

    it.each([
      [null, { id: '1', text: 'Option 1' }],
      [undefined, { id: '1', text: 'Option 1' }],
      ['-', { id: '1', text: 'Option 1' }],
      [null, null],
      [undefined, undefined],
      ['-', []],
    ])(
      'should return empty string for wrong or missing values: value: %o, options: %o',
      (value, options) => {
        const mockParams: ICellRendererParams & {
          options: selectableValuesUtilsModule.SelectableValue[];
          getLabel?: (v: selectableValuesUtilsModule.SelectableValue) => string;
        } = {
          value,
          options,
        } as any;

        spectator.component['setValue'](mockParams);

        expect(spectator.component['value']).toBe('');
      }
    );
  });
});

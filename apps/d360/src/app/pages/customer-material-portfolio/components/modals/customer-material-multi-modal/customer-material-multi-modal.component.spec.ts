import { of } from 'rxjs';

import { GridApi, IRowNode } from 'ag-grid-enterprise';

import { demandCharacteristicOptions } from '../../../../../feature/material-customer/model';
import { DateOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/date-or-original-cell-renderer/date-or-original-cell-renderer.component';
import { SelectDemandCharacteristicOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/select-demand-characteristic-or-original/select-demand-characteristic-or-original.component';
import { SelectableValueOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/selectable-value-or-original/selectable-value-or-original.component';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { Stub } from '../../../../../shared/test/stub.class';
import { parseDemandCharacteristicIfPossible } from '../../../../../shared/utils/parse-values';
import { validateDemandCharacteristicType } from '../../../../../shared/utils/validation/data-validation';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { CustomerMaterialMultiModalComponent } from './customer-material-multi-modal.component';

describe('CustomerMaterialMultiModalComponent', () => {
  let component: CustomerMaterialMultiModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: CustomerMaterialMultiModalComponent,
      providers: [
        Stub.getCMPServiceProvider(),
        Stub.getMatDialogDataProvider({ customerNumber: '42' }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('columnDefinitions', () => {
    it('should define the correct number of columns', () => {
      const columns = component['columnDefinitions'];
      expect(columns.length).toBe(3);
    });

    it('should define the materialNumber column correctly', () => {
      const columns = component['columnDefinitions'];
      const materialNumberColumn = columns.find(
        (col) => col.field === 'materialNumber'
      );

      expect(materialNumberColumn).toBeDefined();
      expect(materialNumberColumn?.headerName).toBe(
        'validation_of_demand.upload_modal.material_number'
      );
      expect(materialNumberColumn?.editable).toBe(true);
      expect(materialNumberColumn?.validationFn).toBeDefined();

      const mockGridApi = {
        forEachNodeAfterFilterAndSort: jest.fn((callback) => {
          callback({ data: { materialNumber: '123' } });
          callback({ data: { materialNumber: '123' } });
        }),
      } as unknown as GridApi;

      const validationFn = materialNumberColumn?.validationFn;
      const errors = validationFn('123', {} as IRowNode, mockGridApi);

      expect(errors).toContain('error.duplicatedMaterialNumber');
    });

    it('should define the phaseInDate column correctly', () => {
      const columns = component['columnDefinitions'];
      const phaseInDateColumn = columns.find(
        (col) => col.field === 'phaseInDate'
      );

      expect(phaseInDateColumn).toBeDefined();
      expect(phaseInDateColumn?.headerName).toBe(
        'customer-material-portfolio.upload_modal.modal.phase_in'
      );
      expect(phaseInDateColumn?.editable).toBe(true);
      expect(phaseInDateColumn?.validationFn).toBe(
        ValidationHelper.validateDateFormatAndGreaterEqualThanToday
      );
      expect(phaseInDateColumn?.cellRenderer).toBe(
        DateOrOriginalCellRendererComponent
      );
    });

    it('should define the demandCharacteristic column correctly', () => {
      const columns = component['columnDefinitions'];
      const demandCharacteristicColumn = columns.find(
        (col) => col.field === 'demandCharacteristic'
      );

      expect(demandCharacteristicColumn).toBeDefined();
      expect(demandCharacteristicColumn?.headerName).toBe(
        'customer-material-portfolio.upload_modal.modal.demand_type'
      );
      expect(demandCharacteristicColumn?.editable).toBe(true);
      expect(demandCharacteristicColumn?.validationFn).toBe(
        validateDemandCharacteristicType
      );
      expect(demandCharacteristicColumn?.cellRenderer).toBe(
        SelectableValueOrOriginalCellRendererComponent
      );
      expect(
        demandCharacteristicColumn?.cellRendererParams?.options.length
      ).toBe(demandCharacteristicOptions.length);
      expect(demandCharacteristicColumn?.cellRendererParams?.getLabel).toBe(
        DisplayFunctions.displayFnText
      );
      expect(demandCharacteristicColumn?.cellEditorParams?.cellRenderer).toBe(
        SelectDemandCharacteristicOrOriginalCellRendererComponent
      );
      expect(demandCharacteristicColumn?.cellEditorParams?.values).toBe(
        demandCharacteristicOptions
      );
      expect(demandCharacteristicColumn?.cellEditor).toBe(
        'agRichSelectCellEditor'
      );
      expect(demandCharacteristicColumn?.cellEditorPopup).toBe(true);
      expect(demandCharacteristicColumn?.width).toBe(220);
    });
  });

  describe('applyFunction', () => {
    it('should call saveBulkPhaseIn with correct parameters', async () => {
      const data = [
        {
          materialNumber: '123',
          phaseInDate: '01/01/2025',
          demandCharacteristic: 'DC1',
        },
      ];
      const dryRun = true;
      const response = { response: [] } as any;
      jest
        .spyOn(component['cMPService'], 'saveBulkPhaseIn')
        .mockReturnValue(of(response));
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('MM/dd/yyyy');

      await component['applyFunction'](data as any, dryRun);

      expect(component['cMPService'].saveBulkPhaseIn).toHaveBeenCalledWith(
        {
          customerNumber: '42',
          phaseInEntities: data.map((row) => ({
            materialNumber: row.materialNumber,
            phaseInDate: '2025-01-01',
            demandCharacteristic: row.demandCharacteristic,
          })),
        },
        dryRun
      );
    });
  });

  describe('parseErrorsFromResult', () => {
    it('should parse errors correctly', () => {
      const result = {
        response: [
          {
            materialNumber: '123',
            result: { messageType: 'ERROR', message: 'sap_message.error' },
          },
        ],
      } as any;

      const errors = component['parseErrorsFromResult'](result);

      expect(errors.length).toBe(1);
      expect(errors[0].dataIdentifier.materialNumber).toBe('123');
      expect(errors[0].errorMessage).toBe('sap_message.error');
    });
  });

  describe('checkDataForErrors', () => {
    it('should check data for errors correctly', () => {
      const data = [
        {
          materialNumber: null,
          phaseInDate: null,
          demandCharacteristic: null,
        },
      ] as any;
      const errors = component['checkDataForErrors'](data);

      expect(errors.length).toBe(3);
      expect(errors[0].specificField).toBe('demandCharacteristic');
      expect(errors[1].specificField).toBe('materialNumber');
      expect(errors[2].specificField).toBe('phaseInDate');
    });
  });

  describe('specialParseFunctionsForFields', () => {
    it('should have correct parse functions', () => {
      jest
        .spyOn(ValidationHelper.localeService, 'localizeDate')
        .mockReturnValue('01/01/2025');
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue('MM/dd/yyyy');
      const parseFunctions = component['specialParseFunctionsForFields'];

      expect(parseFunctions.get('demandCharacteristic')).toBe(
        parseDemandCharacteristicIfPossible
      );
      expect(parseFunctions.get('phaseInDate')('01/01/2025')).toBe(
        '01/01/2025'
      );
    });
  });
});

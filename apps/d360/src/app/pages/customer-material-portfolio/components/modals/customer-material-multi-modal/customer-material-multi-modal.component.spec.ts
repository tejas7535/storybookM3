import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
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
        MockProvider(CMPService),
        MockProvider(MAT_DIALOG_DATA, {
          customerNumber: '42',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('columnDefinitions', () => {
    it('should have correct column definitions', () => {
      const columns = component['columnDefinitions'];

      expect(columns.length).toBe(3);

      expect(columns[0].headerName).toBe(
        'validation_of_demand.upload_modal.material_number'
      );
      expect(columns[0].field).toBe('materialNumber');
      expect(columns[0].editable).toBe(true);

      expect(columns[1].headerName).toBe(
        'customer-material-portfolio.upload_modal.modal.phase_in'
      );
      expect(columns[1].field).toBe('phaseInDate');
      expect(columns[1].editable).toBe(true);
      expect(columns[1].validationFn).toBe(
        ValidationHelper.validateDateFormatAndGreaterEqualThanToday
      );
      expect(columns[1].cellRenderer).toBe(DateOrOriginalCellRendererComponent);

      expect(columns[2].headerName).toBe(
        'customer-material-portfolio.upload_modal.modal.demand_type'
      );
      expect(columns[2].field).toBe('demandCharacteristic');
      expect(columns[2].editable).toBe(true);
      expect(columns[2].validationFn).toBe(validateDemandCharacteristicType);
      expect(columns[2].cellRenderer).toBe(
        SelectableValueOrOriginalCellRendererComponent
      );
      expect(columns[2].cellRendererParams.options.length).toBe(
        demandCharacteristicOptions.length
      );
      expect(columns[2].cellRendererParams.getLabel).toBe(
        DisplayFunctions.displayFnText
      );
      expect(columns[2].cellEditorParams.cellRenderer).toBe(
        SelectDemandCharacteristicOrOriginalCellRendererComponent
      );
      expect(columns[2].cellEditorParams.values).toBe(
        demandCharacteristicOptions
      );
      expect(columns[2].cellEditor).toBe('agRichSelectCellEditor');
      expect(columns[2].cellEditorPopup).toBe(true);
      expect(columns[2].width).toBe(220);
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
});

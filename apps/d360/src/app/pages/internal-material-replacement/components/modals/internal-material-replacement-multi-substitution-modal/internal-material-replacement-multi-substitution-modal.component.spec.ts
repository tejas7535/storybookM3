import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { MockService } from 'ng-mocks';

import { Stub } from '../../../../../shared/test/stub.class';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import { ValidationHelper } from './../../../../../shared/utils/validation/validation-helper';
import { InternalMaterialReplacementMultiSubstitutionModalComponent } from './internal-material-replacement-multi-substitution-modal.component';

describe('InternalMaterialReplacementMultiSubstitutionModalComponent', () => {
  let component: InternalMaterialReplacementMultiSubstitutionModalComponent;

  beforeEach(() => {
    component =
      Stub.get<InternalMaterialReplacementMultiSubstitutionModalComponent>({
        component: InternalMaterialReplacementMultiSubstitutionModalComponent,
      });

    ValidationHelper.localeService = MockService(TranslocoLocaleService);
    jest
      .spyOn(ValidationHelper.localeService, 'localizeDate')
      .mockReturnValue('11/23/2024');
    jest.spyOn(ValidationHelper, 'getDateFormat').mockReturnValue('yyyy-mm-dd');
  });

  describe('ngOnInit', () => {
    it('should call super.ngOnInit', () => {
      const spy = jest.spyOn(
        InternalMaterialReplacementMultiSubstitutionModalComponent.prototype,
        'ngOnInit'
      );
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getMultiSubstitutionModalColumns', () => {
    it('should return column definitions', () => {
      const columns = component['getMultiSubstitutionModalColumns']();
      expect(columns).toBeDefined();
      expect(columns.length).toBeGreaterThan(0);
    });
  });

  describe('parseErrorsFromResult', () => {
    it('should parse errors from result', () => {
      const mockResponse = {
        response: [
          {
            result: { messageType: MessageType.Error },
            replacementType: 'type',
            region: 'region',
            salesArea: 'area',
            salesOrg: 'org',
            customerNumber: '123',
            predecessorMaterial: 'material',
          },
        ],
      } as any;
      const errors = component['parseErrorsFromResult'](mockResponse);
      expect(errors.length).toBe(1);
      expect(errors[0].errorMessage).toBeDefined();
    });
  });

  describe('checkDataForErrors', () => {
    it('should check data for errors and find errors', () => {
      const mockData = [
        {
          replacementType: 'RELOCATION' as any,
          region: 'region',
          salesArea: 'area',
          salesOrg: 'org',
          customerNumber: '123',
          predecessorMaterial: 'material',
          successorMaterial: 'material',
          startOfProduction: '2025-02-14',
          cutoverDate: '2025-02-14',
          replacementDate: '2025-02-14',
          note: 'note',
        },
      ];
      const errors = component['checkDataForErrors'](mockData);
      expect(errors).toEqual([
        {
          dataIdentifier: expect.anything(),
          specificField: 'salesArea',
          errorMessage: 'internal_material_replacement.error.fieldNotAllowed',
        },
        {
          dataIdentifier: expect.anything(),
          specificField: 'salesOrg',
          errorMessage: 'internal_material_replacement.error.fieldNotAllowed',
        },
        {
          dataIdentifier: expect.anything(),
          specificField: 'customerNumber',
          errorMessage: 'internal_material_replacement.error.fieldNotAllowed',
        },
        {
          dataIdentifier: expect.anything(),
          specificField: 'replacementDate',
          errorMessage: 'internal_material_replacement.error.fieldNotAllowed',
        },
      ]);
    });

    it('should check data for errors and find no errors', () => {
      const mockData = [
        {
          replacementType: 'RELOCATION' as any,
          region: 'region',
          salesArea: undefined,
          salesOrg: undefined,
          customerNumber: undefined,
          predecessorMaterial: 'material',
          successorMaterial: 'material',
          startOfProduction: '2025-02-14',
          cutoverDate: '2025-02-14',
          replacementDate: undefined,
          note: 'note',
        },
      ] as any;
      const errors = component['checkDataForErrors'](mockData);
      expect(errors.length).toBe(0);
    });
  });

  describe('onAdded', () => {
    it('should close the dialog with true', () => {
      jest.spyOn(component['dialogRef'], 'close');

      component['onAdded']();

      expect(component['dialogRef'].close).toHaveBeenCalledWith(true);
    });
  });

  describe('applyFunction', () => {
    it('should call apiCall with data and dryRun', async () => {
      const mockData = [
        {
          replacementType: 'type',
          region: 'region',
          salesArea: 'area',
          salesOrg: 'org',
          customerNumber: '123',
          predecessorMaterial: 'material',
          successorMaterial: 'material',
          startOfProduction: '2025-01-14',
          cutoverDate: '2025-01-14',
          replacementDate: '2025-01-14',
          note: 'note',
        },
      ] as any;

      const apiCallSpy = jest
        .spyOn(component['imrService'], 'saveMultiIMRSubstitution')
        .mockReturnValue(of({} as any));

      await component['applyFunction'](mockData, true);

      expect(apiCallSpy).toHaveBeenCalledWith(mockData, true);
    });
  });
});

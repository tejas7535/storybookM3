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

  describe('specialParseFunctionsForFields', () => {
    it('should contain parse functions for date fields', () => {
      const specialParseFunctions = component['specialParseFunctionsForFields'];
      expect(specialParseFunctions).toBeDefined();
      expect(specialParseFunctions.has('startOfProduction')).toBeTruthy();
      expect(specialParseFunctions.has('cutoverDate')).toBeTruthy();
      expect(specialParseFunctions.has('replacementDate')).toBeTruthy();
    });

    it('should format date string correctly', () => {
      const specialParseFunctions = component['specialParseFunctionsForFields'];
      const dateFn = specialParseFunctions.get('startOfProduction');
      expect(dateFn).toBeDefined();

      const result = dateFn('2023-11-15');
      expect(result).toBeDefined();

      expect(typeof result).toBe('string');
    });

    it('should handle null and undefined date values', () => {
      jest
        .spyOn(ValidationHelper, 'validateDateFormat')
        .mockReturnValue('error');
      const specialParseFunctions = component['specialParseFunctionsForFields'];
      const dateFn = specialParseFunctions.get('cutoverDate');
      expect(dateFn).toBeDefined();

      expect(dateFn(null)).toBeNull();
      expect(dateFn(undefined as any)).toBeUndefined();
    });

    it('should handle invalid date values', () => {
      const specialParseFunctions = component['specialParseFunctionsForFields'];
      const dateFn = specialParseFunctions.get('replacementDate');
      expect(dateFn).toBeDefined();

      const result = dateFn('not-a-date');
      expect(result).not.toBeUndefined();
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

    it('should format dates correctly in API call', async () => {
      const mockData = [
        {
          replacementType: 'type',
          region: 'region',
          predecessorMaterial: 'material',
          successorMaterial: 'material',
          startOfProduction: '2025-01-14',
          cutoverDate: '2025-02-15',
          replacementDate: '2025-03-16',
        },
      ] as any;

      const apiCallSpy = jest
        .spyOn(component['imrService'], 'saveMultiIMRSubstitution')
        .mockReturnValue(of({} as any));

      await component['applyFunction'](mockData, false);

      expect(apiCallSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            startOfProduction: expect.any(String),
            cutoverDate: expect.any(String),
            replacementDate: expect.any(String),
          }),
        ]),
        false
      );
    });

    it('should handle null or undefined dates correctly', async () => {
      const mockData = [
        {
          replacementType: 'type',
          region: 'region',
          predecessorMaterial: 'material',
          successorMaterial: 'material',
          startOfProduction: null,
          cutoverDate: undefined,
          replacementDate: '2025-01-14',
        },
      ] as any;

      const apiCallSpy = jest
        .spyOn(component['imrService'], 'saveMultiIMRSubstitution')
        .mockReturnValue(of({} as any));

      await component['applyFunction'](mockData, false);

      expect(apiCallSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            startOfProduction: null,
            cutoverDate: null,
            replacementDate: expect.any(String),
          }),
        ]),
        false
      );
    });

    it('should process multiple rows of data correctly', async () => {
      const mockData = [
        {
          replacementType: 'type1',
          region: 'region1',
          predecessorMaterial: 'material1',
          successorMaterial: 'material2',
          startOfProduction: '2025-01-14',
          cutoverDate: '2025-02-15',
          replacementDate: '2025-03-16',
        },
        {
          replacementType: 'type2',
          region: 'region2',
          predecessorMaterial: 'material3',
          successorMaterial: 'material4',
          startOfProduction: '2025-04-17',
          cutoverDate: '2025-05-18',
          replacementDate: '2025-06-19',
        },
      ] as any;

      const apiCallSpy = jest
        .spyOn(component['imrService'], 'saveMultiIMRSubstitution')
        .mockReturnValue(of({} as any));

      await component['applyFunction'](mockData, false);

      expect(apiCallSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            replacementType: 'type1',
            region: 'region1',
          }),
          expect.objectContaining({
            replacementType: 'type2',
            region: 'region2',
          }),
        ]),
        false
      );
      expect(apiCallSpy.mock.calls[0][0].length).toBe(2);
    });
  });
});

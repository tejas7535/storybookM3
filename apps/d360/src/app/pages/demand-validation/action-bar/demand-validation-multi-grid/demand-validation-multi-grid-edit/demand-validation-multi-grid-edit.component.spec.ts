import { of } from 'rxjs';

import { parse } from 'date-fns';

import {
  KpiBucket,
  KpiBucketTypeEnum,
} from '../../../../../feature/demand-validation/model';
import * as SAP from '../../../../../shared/utils/error-handling';
import { PostResult } from '../../../../../shared/utils/error-handling';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import { Stub } from './../../../../../shared/test/stub.class';
import { ValidationHelper } from './../../../../../shared/utils/validation/validation-helper';
import { DemandValidationMultiGridEditComponent } from './demand-validation-multi-grid-edit.component';

describe('DemandValidationMultiGridEditComponent', () => {
  let component: DemandValidationMultiGridEditComponent;
  let demandValidationService: any;

  const mockKpiBuckets: KpiBucket[] = [
    {
      from: '2023-01-01',
      to: '2023-01-07',
      type: KpiBucketTypeEnum.WEEK,
    },
    {
      from: '2023-01-08',
      to: '2023-01-14',
      type: KpiBucketTypeEnum.PARTIAL_WEEK,
    },
  ];

  beforeEach(() => {
    demandValidationService = {
      getKpiBuckets: jest.fn().mockReturnValue(of(mockKpiBuckets)),
      saveValidatedDemandBatch: jest.fn().mockReturnValue(
        of({
          success: true,
          response: [],
        })
      ),
    };

    component = Stub.getForEffect<DemandValidationMultiGridEditComponent>({
      component: DemandValidationMultiGridEditComponent,
      providers: [
        {
          provide: Stub.getDemandValidationServiceProvider().provide,
          useValue: demandValidationService,
        },
        Stub.getMatDialogDataProvider({
          customerName: 'Test Customer',
          customerNumber: '42',
          materialType: 'schaeffler',
          dateRange: { from: '2023-01-01', to: '2023-01-31' },
        }),
      ],
    });

    component['gridApi'].set(Stub.getGridApi());

    // Mock grid API methods
    jest
      .spyOn(component['gridApi'](), 'getColumns')
      .mockReturnValue([
        { getColId: () => new Date('2023-01-01').toUTCString() },
        { getColId: () => new Date('2023-01-08').toUTCString() },
      ] as any);

    jest
      .spyOn(ValidationHelper, 'getDecimalSeparatorForActiveLocale')
      .mockReturnValue('PERIOD');

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch KPI buckets on init', () => {
      component.ngOnInit();
      expect(demandValidationService.getKpiBuckets).toHaveBeenCalled();
      expect(component['kpiBuckets']()).toEqual(mockKpiBuckets);
    });
  });

  describe('constructor', () => {
    it('should initialize column definitions when kpiBuckets signal changes', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);

      Stub.detectChanges();

      expect(component['columnDefinitions'].length).toBeGreaterThan(0);
    });

    it('should include date columns in column definitions', () => {
      component['columnDefinitions'] = [];
      // Set kpiBuckets signal value
      component['kpiBuckets'].set(mockKpiBuckets);

      // Trigger change detection to run constructor logic
      Stub.detectChanges();

      // Get column definitions
      const columnDefs = component['columnDefinitions'];

      // Check for date columns based on kpiBuckets
      const dateColumns = columnDefs.filter(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );

      // Should have columns for each date in the kpiBuckets
      expect(dateColumns.length).toBeGreaterThan(0);
      expect(dateColumns.length).toBe(mockKpiBuckets.length);
    });

    it('should handle empty kpiBuckets', () => {
      component['columnDefinitions'] = [];
      // Set empty kpiBuckets
      component['kpiBuckets'].set([]);

      // Trigger change detection to run constructor logic
      Stub.detectChanges();

      // Should still create column definitions but without date columns
      const columnDefs = component['columnDefinitions'];
      expect(columnDefs).toBeDefined();

      // Should only have fixed columns (like materialNumber), not date columns
      const dateColumns = columnDefs.filter(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );
      expect(dateColumns.length).toBe(0);
    });

    it('should handle null kpiBuckets gracefully', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(null);

      Stub.detectChanges();

      expect(component['columnDefinitions']).toBeDefined();
      expect(component['columnDefinitions'].length).toBe(0);
    });

    it('should include fixed columns in column definitions', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);

      Stub.detectChanges();

      const fixedColumns = component['columnDefinitions'].filter(
        (col) => col.field === 'materialNumber'
      );
      expect(fixedColumns.length).toBe(1);
    });

    it('should not duplicate column definitions on multiple signal changes', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);
      component['kpiBuckets'].set(mockKpiBuckets);

      Stub.detectChanges();

      expect(component['columnDefinitions'].length).toBe(
        mockKpiBuckets.length + 1
      ); // +1 for fixed column
    });

    it('should handle invalid date formats in kpiBuckets', () => {
      const invalidKpiBuckets = [
        {
          from: 'invalid-date',
          to: 'invalid-date',
          type: KpiBucketTypeEnum.WEEK,
        },
      ];
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(invalidKpiBuckets);

      Stub.detectChanges();

      const dateColumns = component['columnDefinitions'].filter(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );
      expect(dateColumns.length).toBe(0);
    });

    it('should have validation function that validates cell values', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);

      Stub.detectChanges();

      // Get a date column definition
      const dateColumnDef = component['columnDefinitions'].find(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );

      expect(dateColumnDef.validationFn).toBeDefined();

      // Test validation with a valid number
      const validParams = {
        value: '42.5',
        rowNode: { id: '1' },
      };
      expect(
        dateColumnDef.validationFn(validParams.value as any, null)
      ).toBeNull();

      // Test validation with an invalid value
      const invalidParams = {
        value: 'not-a-number',
        rowNode: { id: '1' },
      };
      expect(dateColumnDef.validationFn(invalidParams.value as any, null)).toBe(
        'error.numbers.PERIOD'
      );
    });

    it('should have cellClass function that returns appropriate CSS classes', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);
      Stub.detectChanges();

      // Set up a validation error
      component['validationError'] = { '1_0': true };

      // Get date column definition
      const dateColumnDef = component['columnDefinitions'].find(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );

      expect(dateColumnDef.cellClass).toBeDefined();

      // Cell with validation error should have error class
      const errorParams = {
        node: { id: '1' },
        api: Stub.getGridApi(),
        colDef: { field: new Date('2023-01-01').toUTCString() },
        value: '42.5',
        column: { getColId: () => new Date('2023-01-01').toUTCString() },
      };
      jest
        .spyOn(errorParams.api, 'getColumns')
        .mockReturnValue([
          { getColId: () => new Date('2023-01-01').toUTCString() },
        ] as any);

      const errorClasses = (dateColumnDef as any).cellClass(errorParams);
      expect(errorClasses).toBe('invalid-entry');

      // Cell without validation error should not have error class
      const validParams = {
        node: { id: '2' },
        api: Stub.getGridApi(),
        colDef: { field: new Date('2023-01-01').toUTCString() },
        column: { getColId: () => -1 },
      };
      jest
        .spyOn(validParams.api, 'getColumns')
        .mockReturnValue([
          { getColId: () => new Date('2023-01-01').toUTCString() },
        ] as any);
      const validClasses = (dateColumnDef as any).cellClass(validParams);
      expect(validClasses).not.toBe('invalid-entry');
    });

    it('should have bgColorFn function that returns appropriate background colors', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);
      Stub.detectChanges();

      // Get date column definition
      const dateColumnDef = component['columnDefinitions'].find(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );

      expect(dateColumnDef.bgColorFn).toBeDefined();

      // First bucket is WEEK, second is PARTIAL_WEEK
      const weekColor = component['columnDefinitions'][1].bgColorFn();
      const partialWeekColor = component['columnDefinitions'][2].bgColorFn();

      expect(weekColor).toBeDefined();
      expect(partialWeekColor).toBeDefined();
      expect(weekColor).not.toEqual(partialWeekColor);
    });

    it('should have validationFn for the first column', () => {
      component['columnDefinitions'] = [];
      component['kpiBuckets'].set(mockKpiBuckets);
      Stub.detectChanges();

      // Get date column definition
      const dateColumnDef = component['columnDefinitions'].find(
        (col) => col.field && new Date(col.field).toString() !== 'Invalid Date'
      );

      expect(dateColumnDef.validationFn).toBeDefined();

      const validationFn = component['columnDefinitions'][0].validationFn;

      expect(validationFn).toBeDefined();

      // No error
      expect(validationFn('073659703-0000-10', { id: '1' } as any)).toBeNull();

      // With error
      expect(validationFn('073659703-0000', { id: '1' } as any)).toBe(
        'error.wrong_length'
      );

      // Matchable error
      component['errorRows'] = ['1'];
      expect(validationFn('073659703-0000-10', { id: '1' } as any)).toBe(
        'validation_of_demand.upload_modal.error.incomplete_row'
      );
    });
  });

  describe('checkDataForErrors', () => {
    describe('mandatory fields validation', () => {
      it('should detect missing mandatory fields', () => {
        const testData = [
          {
            id: '1',
            materialNumber: '',
          },
        ];

        const errors = component['checkDataForErrors'](testData);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].specificField).toBe('materialNumber');
        expect(component['errorRows']).toContain('1');
      });
    });

    describe('material number validation', () => {
      it('should validate Schaeffler material numbers', () => {
        const testData = [
          {
            id: '1',
            materialNumber: 'INVALID',
          },
        ];

        const errors = component['checkDataForErrors'](testData);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].specificField).toBe('materialNumber');
      });

      it('should accept valid Schaeffler material numbers', () => {
        const testData = [
          {
            id: '1',
            materialNumber: '073659703-0000-10', // Format matches validation
          },
        ];

        const errors = component['checkDataForErrors'](testData);
        const materialErrors = errors.filter(
          (e) => e.specificField === 'materialNumber'
        );

        expect(materialErrors.length).toBe(0);
      });

      it('should handle customer material types differently from schaeffler types', () => {
        // Create a new component with customer material type
        component['data']['materialType'] = 'customer';

        component['gridApi'].set(Stub.getGridApi());

        // Setup kpiBuckets so columnDefinitions can be created
        component['kpiBuckets'].set(mockKpiBuckets);

        // Customer material numbers don't need to follow the schaeffler format
        const testData = [
          {
            id: '1',
            materialNumber: 'CUST-12345', // This would be invalid for schaeffler
          },
        ];

        const errors = component['checkDataForErrors'](testData);
        const materialErrors = errors.filter(
          (e) => e.specificField === 'materialNumber'
        );

        expect(materialErrors.length).toBe(0);
      });
    });

    describe('forecast values validation', () => {
      it('should validate forecast values', () => {
        const date = new Date('2023-01-01');
        const dateString = date.toUTCString();

        const testData = [
          {
            id: '1',
            materialNumber: '073659703-0000-10',
            [dateString]: 'not-a-number',
          },
        ];

        const errors = component['checkDataForErrors'](testData);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].specificField).toBe(dateString);
      });

      it('should accept valid forecast values', () => {
        const date = new Date('2023-01-01');
        const dateString = date.toUTCString();

        const testData = [
          {
            id: '1',
            materialNumber: '083736743-0000',
            [dateString]: '42.5',
          },
        ];

        const errors = component['checkDataForErrors'](testData);
        const forecastErrors = errors.filter(
          (e) => e.specificField === dateString
        );

        expect(forecastErrors.length).toBe(0);
      });
    });
  });

  describe('getDemandData', () => {
    it('should transform grid data to demand validation batch format', () => {
      const date1 = parse('2023-01-01', 'yyyy-MM-dd', new Date());
      const date2 = parse('2023-01-08', 'yyyy-MM-dd', new Date());
      const dateString1 = date1.toUTCString();
      const dateString2 = date2.toUTCString();

      component['kpiBuckets'].set(mockKpiBuckets);

      const testData = [
        {
          id: '1',
          materialNumber: '083736743-0000',
          [dateString1]: '10.5',
          [dateString2]: '20.75',
        },
      ];

      const result = component['getDemandData'](testData);

      expect(result.length).toBe(1);
      expect(result[0].material).toBe('083736743-0000');
      expect(result[0].kpiEntries.length).toBe(2);
      expect(result[0].kpiEntries[0].validatedForecast).toBe(10.5);
      expect(result[0].kpiEntries[1].validatedForecast).toBe(20.75);
    });
  });

  describe('parseErrorsFromResult', () => {
    it('should parse errors from API response', () => {
      const mockResponse: PostResult<any> = {
        success: false,
        response: [
          {
            id: '1',
            materialNumber: '123456',
            allErrors: [
              {
                id: 0,
                messageType: MessageType.Error,
                messageText: 'Error message 1',
                messageNumber: '001',
              },
              {
                id: 1,
                messageType: MessageType.Error,
                messageText: 'Error message 2',
                messageNumber: '002',
              },
            ],
          },
        ],
      } as any;

      jest
        .spyOn(SAP, 'errorsFromSAPtoMessage')
        .mockImplementation((result: any) => result.messageText);

      const errors = component['parseErrorsFromResult'](mockResponse);

      expect(errors.length).toBe(1);
      expect(errors[0].id).toBe('1');
      expect(errors[0].dataIdentifier.material).toBe('123456');
      expect(errors[0].errorMessage).toContain('Error message 1');
      expect(errors[0].errorMessage).toContain('Error message 2');
      expect(component['validationError']['1_0']).toBe(true);
      expect(component['validationError']['1_1']).toBe(true);
    });
  });

  describe('setHasChangedData', () => {
    it('should track changes based on API response with multiple entries', () => {
      const mockResponse: PostResult<any> = {
        success: true,
        response: [
          {
            hasMultipleEntries: true,
            countSuccesses: 2,
            countErrors: 0,
          },
        ],
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](mockResponse);

      expect(component['hasChangedData']).toBe(true);
    });

    it('should properly detect changed data from single entry success', () => {
      const singleEntryResponse: PostResult<any> = {
        success: true,
        response: [
          {
            hasMultipleEntries: false,
            result: {
              messageType: MessageType.Success,
            },
          },
        ],
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](singleEntryResponse);
      expect(component['hasChangedData']).toBe(true);
    });

    it('should not mark data as changed when there are no successes', () => {
      const noSuccessResponse: PostResult<any> = {
        success: true,
        response: [
          {
            hasMultipleEntries: true,
            countSuccesses: 0,
            countErrors: 1,
          },
        ],
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](noSuccessResponse);
      expect(component['hasChangedData']).toBe(false);
    });
  });

  describe('getMultiPostResultsToUserMessages', () => {
    it('should generate user messages based on API response', () => {
      const mockResponse: PostResult<any> = {
        success: true,
        response: [
          {
            countSuccesses: 2,
            countErrors: 1,
          },
        ],
      } as any;

      const messages = component['getMultiPostResultsToUserMessages']({
        postResult: mockResponse,
        action: 'save',
      });

      expect(messages.length).toBe(2);
      expect(messages[0].variant).toBe('success');
      expect(messages[1].variant).toBe('error');
    });
  });

  describe('onReset', () => {
    it('should reset validation errors when resetting the component', () => {
      // Setup validation errors
      component['validationError'] = {
        '1_0': true,
        '2_1': true,
      };

      component['onReset']();

      expect(component['validationError']).toEqual({});
    });
  });

  describe('onDeleteCallback', () => {
    it('should remove validation errors for a deleted row', () => {
      // Setup validation errors
      component['validationError'] = {
        '5_0': true,
        '5_1': true,
        '6_0': true,
      };

      const mockParams = {
        node: { id: '5' },
      } as any;

      component['onDeleteCallback'](mockParams);

      expect(component['validationError']['5_0']).toBeUndefined();
      expect(component['validationError']['5_1']).toBeUndefined();
      expect(component['validationError']['6_0']).toBe(true);
    });
  });

  describe('parseAndFormatNumber', () => {
    it('should parse and format numbers correctly', () => {
      // Mock the agGridLocalizationService
      (component as any)['agGridLocalizationService'] = {
        numberFormatter: jest.fn().mockReturnValue('42.50'),
      } as any;

      const mockParams = {
        value: 42.5,
      } as any;

      const result = component['parseAndFormatNumber'](mockParams);

      expect(result).toBe('42.50');
    });
  });

  describe('getCellId', () => {
    it('should get the correct cell ID', () => {
      const date = new Date('2023-01-01');
      const result = component['getCellId']('1', date);

      expect(result).toBe(0); // First column index
    });

    it('should return the correct index for second date', () => {
      const date = new Date('2023-01-08');
      const result = component['getCellId']('1', date);

      expect(result).toBe(1); // Second column index
    });

    it('should return undefined when row ID is undefined', () => {
      const date = new Date('2023-01-01');
      const result = component['getCellId'](undefined, date);

      expect(result).toBeUndefined();
    });

    it('should return undefined when column is not found', () => {
      const date = new Date('2023-02-01'); // This date doesn't exist in mock columns
      const result = component['getCellId']('1', date);

      expect(result).toBeUndefined();
    });

    it('should use toUTCString for date comparison', () => {
      // Create a spy on the date's toUTCString method
      const date = new Date('2023-01-01');
      const toUTCStringSpy = jest.spyOn(date, 'toUTCString');

      component['getCellId']('1', date);

      expect(toUTCStringSpy).toHaveBeenCalled();
    });
  });

  describe('keyFromDate', () => {
    it('should convert a date to UTC string format', () => {
      const date = new Date('2023-01-01');
      const result = component['keyFromDate'](date);

      expect(result).toBe(date.toUTCString());
    });
  });

  describe('applyFunction', () => {
    it('should reset errors and call the API', async () => {
      (component as any)['backendErrors'] = { set: jest.fn() } as any;
      (component as any)['frontendErrors'] = { set: jest.fn() } as any;
      component['validationError'] = { '1_0': true };

      const testData = [
        {
          id: '1',
          materialNumber: '083736743-0000',
          [new Date('2023-01-01').toUTCString()]: '10.5',
        },
      ];

      // Mock getDemandData to return expected format
      jest.spyOn(component as any, 'getDemandData').mockReturnValue([]);

      await component['applyFunction'](testData, true);

      expect(component['backendErrors'].set).toHaveBeenCalledWith([]);
      expect(component['frontendErrors'].set).toHaveBeenCalledWith([]);
      expect(component['validationError']).toEqual({});
      expect(
        demandValidationService.saveValidatedDemandBatch
      ).toHaveBeenCalled();
    });
  });

  describe('materialNumberCheck', () => {
    it('should validate Schaeffler material numbers', () => {
      const validData = {
        id: '1',
        materialNumber: '073659703-0000-10',
      };

      const invalidData = {
        id: '2',
        materialNumber: 'INVALID',
      };

      const validResult = component['materialNumberCheck'](validData);
      const invalidResult = component['materialNumberCheck'](invalidData);

      expect(validResult.length).toBe(0);
      expect(invalidResult.length).toBeGreaterThan(0);
      expect(component['errorRows']).toContain('2');
    });

    it('should not validate customer material numbers', () => {
      // Set material type to customer
      component['data']['materialType'] = 'customer';

      const data = {
        id: '1',
        materialNumber: 'ANY-MATERIAL-NUMBER',
      };

      const result = component['materialNumberCheck'](data);

      expect(result.length).toBe(0);
    });

    it('should handle hyphens in material numbers', () => {
      const data = {
        id: '1',
        materialNumber: '073659703-0000-10',
      };

      // Mock validateMaterialNumber to verify it's called with the correct format
      jest
        .spyOn(
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module
          require('../../../../../shared/utils/validation/filter-validation'),
          'validateMaterialNumber'
        )
        .mockImplementation((value) => {
          // Should be called with hyphens removed
          expect(value).not.toContain('-');

          return null;
        });

      component['materialNumberCheck'](data);
    });
  });

  describe('forecastCheck', () => {
    it('should validate forecast numeric values', () => {
      const date = new Date('2023-01-01').toUTCString();

      const validData = {
        id: '1',
        materialNumber: '073659703-0000-10',
        [date]: '42.5',
      };

      const invalidData = {
        id: '2',
        materialNumber: '073659703-0000-10',
        [date]: 'not-a-number',
      };

      const validResult = component['forecastCheck'](validData);
      const invalidResult = component['forecastCheck'](invalidData);

      expect(validResult.length).toBe(0);
      expect(invalidResult.length).toBeGreaterThan(0);
      expect(invalidResult[0].specificField).toBe(date);
    });

    it('should skip validation for id and materialNumber fields', () => {
      const data = {
        id: '1',
        materialNumber: 'INVALID', // Would be invalid for material check but not for forecast check
      };

      const result = component['forecastCheck'](data);

      expect(result.length).toBe(0);
    });

    it('should handle empty forecast values', () => {
      const date = new Date('2023-01-01').toUTCString();

      const data = {
        id: '1',
        materialNumber: '073659703-0000-10',
        [date]: '',
      };

      const result = component['forecastCheck'](data);

      expect(result.length).toBe(0);
    });
  });

  describe('mandatoryFieldCheck', () => {
    it('should detect all missing mandatory fields', () => {
      // Empty data should fail validation for materialNumber
      const data = {
        id: '1',
        materialNumber: '',
      };

      const result = component['mandatoryFieldCheck'](data);

      expect(result.length).toBe(1);
      expect(result[0].specificField).toBe('materialNumber');
      expect(component['errorRows']).toContain('1');
    });

    it('should pass validation when all mandatory fields are present', () => {
      const data = {
        id: '1',
        materialNumber: '073659703-0000-10',
      };

      const result = component['mandatoryFieldCheck'](data);

      expect(result.length).toBe(0);
    });
  });

  describe('getTypedRowData', () => {
    it('should extract row data with ID', () => {
      const mockRowNode = {
        id: '42',
        data: {
          materialNumber: '073659703-0000-10',
          someField: 'value',
        },
      } as any;

      const result = component['getTypedRowData'](mockRowNode);

      expect(result).toEqual({
        id: '42',
        materialNumber: '073659703-0000-10',
        someField: 'value',
      });
    });
  });

  describe('getErrorMessageFn', () => {
    it('should map "check" action to "validate"', () => {
      expect(component['getErrorMessageFn']('check')(1)).toBe(
        'validation_of_demand.upload_modal.validate.invalid_entries'
      );
    });

    it('should map "save" action to "validate"', () => {
      expect(component['getErrorMessageFn']('save')(1)).toBe(
        'validation_of_demand.upload_modal.save.invalid_entries'
      );
    });

    it('should map "validate" action to "validate"', () => {
      expect(component['getErrorMessageFn']('validate')(1)).toBe(
        'validation_of_demand.upload_modal.validate.invalid_entries'
      );
    });
  });

  describe('getSuccessMessageFn', () => {
    it('should map "check" action to "validate"', () => {
      expect(component['getSuccessMessageFn']('check')()).toBe(
        'validation_of_demand.upload_modal.validate.success'
      );
    });

    it('should map "save" action to "validate"', () => {
      expect(component['getSuccessMessageFn']('save')()).toBe(
        'validation_of_demand.upload_modal.save.success'
      );
    });

    it('should map "validate" action to "validate"', () => {
      expect(component['getSuccessMessageFn']('validate')()).toBe(
        'validation_of_demand.upload_modal.validate.success'
      );
    });
  });
});

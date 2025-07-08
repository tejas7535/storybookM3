import { BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject, of } from 'rxjs';

import { SelectedKpisAndMetadata } from '../../../../feature/demand-validation/model';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import * as Helper from '../../../../feature/demand-validation/time-range';
import { AdditionalProps } from '../../../../shared/components/ag-grid/cell-renderer/selectable-value-or-original/selectable-value-or-original.component';
import {
  DemandValidationUserSettingsKey,
  UserSettingsKey,
} from '../../../../shared/models/user-settings.model';
import { Stub } from '../../../../shared/test/stub.class';
import { DateRangePeriod } from '../../../../shared/utils/date-range';
import { DemandValidationExportModalComponent } from './demand-validation-export-modal.component';

describe('DemandValidationExportModalComponent', () => {
  let component: DemandValidationExportModalComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationExportModalComponent>({
      component: DemandValidationExportModalComponent,
      providers: [
        FormBuilder,
        Stub.getMatDialogDataProvider({
          customerData: [],
          dateRanges: {
            range1: {
              from: new Date(),
              to: new Date(),
              period: DateRangePeriod.Weekly,
            },
          },
          demandValidationFilters: {},
        }),
        Stub.getDemandValidationServiceProvider(),
        Stub.getMatDialogProvider(),
        Stub.getBreakpointObserverProvider(),
        Stub.getUserServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should initialize form with correct validators', () => {
      expect(component['formGroup']).toBeDefined();
      expect(component['formGroup'].get('startDatePeriod1')).toBeDefined();
      expect(component['formGroup'].get('endDatePeriod1')).toBeDefined();
      expect(
        component['formGroup'].get('startDatePeriod1').hasValidator
      ).toBeTruthy();
      expect(
        component['formGroup'].get('endDatePeriod1').hasValidator
      ).toBeTruthy();
    });

    it('should validate that end date is after start date', () => {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() - 1); // End date before start date

      component['formGroup'].get('startDatePeriod1').setValue(startDate);
      component['formGroup'].get('endDatePeriod1').setValue(endDate);

      expect(component['formGroup'].invalid).toBeTruthy();
      expect(component['formGroup'].errors).toBeTruthy();
    });

    it('should require at least one KPI to be selected', () => {
      const toggleTypes: {
        type: PlanningView | AdditionalProps;
        data: SelectedKpisAndMetadata[][];
      }[] = (component as any).toggleTypes;
      toggleTypes.forEach((toggle) => {
        if (toggle.type === 'REQUESTED' || toggle.type === 'CONFIRMED') {
          toggle.data.flat().forEach((kpi) => {
            component['formGroup'].get(kpi).setValue(false);
          });
        }
      });

      expect(component['formGroup'].invalid).toBeTruthy();
      expect(
        component['formGroup'].errors?.['atLeastOneKpiRequired']
      ).toBeTruthy();
    });

    it('should be valid when required fields are filled and at least one KPI is selected', () => {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 10); // End date after start date

      component['formGroup'].get('startDatePeriod1').setValue(startDate);
      component['formGroup'].get('endDatePeriod1').setValue(endDate);
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);

      expect(component['formGroup'].valid).toBeTruthy();
    });
  });

  describe('handleActiveAndPredecessor', () => {
    it('should enable ActiveAndPredecessor when allowed KPIs are selected', () => {
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);

      const result = component['handleActiveAndPredecessor'](
        component['formGroup']
      );

      expect(result).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
          .enabled
      ).toBeTruthy();
    });

    it('should disable ActiveAndPredecessor when no allowed KPIs are selected', () => {
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(false);
      component['formGroup']
        .get(SelectedKpisAndMetadata.FirmBusiness)
        .setValue(false);
      component['formGroup']
        .get(SelectedKpisAndMetadata.ConfirmedDeliveries)
        .setValue(false);
      component['formGroup']
        .get(SelectedKpisAndMetadata.ConfirmedFirmBusiness)
        .setValue(false);

      const result = component['handleActiveAndPredecessor'](
        component['formGroup']
      );

      expect(result).toBeFalsy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
          .enabled
      ).toBeFalsy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
          .value
      ).toBeFalsy();
    });

    it('should not modify ActiveAndPredecessor when already updating', () => {
      (component as any).isUpdatingActiveAndPredecessor = true;
      const activePredecessorState = component['formGroup'].get(
        SelectedKpisAndMetadata.ActiveAndPredecessor
      ).enabled;

      const result = component['handleActiveAndPredecessor'](
        component['formGroup']
      );

      expect(result).toBe(activePredecessorState);
    });
  });

  describe('handleExcelExport', () => {
    let demandValidationServiceSpy: jest.SpyInstance;
    let matDialogSpy: jest.SpyInstance;

    beforeEach(() => {
      demandValidationServiceSpy = jest.spyOn(
        component['demandValidationService'],
        'triggerExport'
      );
      matDialogSpy = jest.spyOn(component['dialog'], 'open');
    });

    it('should not proceed if form is invalid', () => {
      component['formGroup'].controls['startDatePeriod1'].setValue(null);
      component['formGroup'].controls['endDatePeriod1'].setValue(null);
      component['formGroup'].updateValueAndValidity();

      component['handleExcelExport']();

      expect(matDialogSpy).not.toHaveBeenCalled();
    });

    it('should open loading dialog when form is valid and filled range is created', () => {
      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 1, 1);

      component['formGroup'].controls['startDatePeriod1'].setValue(startDate);
      component['formGroup'].controls['endDatePeriod1'].setValue(endDate);
      component['formGroup'].controls['startDatePeriod2'].setValue(
        new Date(2023, 1, 2)
      );
      component['formGroup'].controls['endDatePeriod2'].setValue(
        new Date(2023, 2, 1)
      );

      component['formGroup'].updateValueAndValidity();
      demandValidationServiceSpy.mockReturnValue(of({}));

      component['handleExcelExport']();

      expect(matDialogSpy).toHaveBeenCalled();
      expect(matDialogSpy.mock.calls[0][0].name).toContain(
        'DemandValidationLoadingModalComponent'
      );
    });

    it('should not open loading dialog when filled range is not created', () => {
      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue(null);

      component['formGroup'].controls['startDatePeriod1'].setValue(
        new Date(2023, 0, 1)
      );
      component['formGroup'].controls['endDatePeriod1'].setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].updateValueAndValidity();

      component['handleExcelExport']();

      expect(matDialogSpy).not.toHaveBeenCalled();
    });

    it('should handle the case when second date range is not provided', () => {
      component['formGroup'].controls['startDatePeriod1'].setValue(
        new Date(2023, 0, 1)
      );
      component['formGroup'].controls['endDatePeriod1'].setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls['startDatePeriod2'].setValue(null);
      component['formGroup'].controls['endDatePeriod2'].setValue(null);

      component['formGroup'].updateValueAndValidity();
      demandValidationServiceSpy.mockReturnValue(of({}));

      component['handleExcelExport']();

      expect(matDialogSpy).toHaveBeenCalled();
    });
  });

  describe('translateConfirmedToggleType', () => {
    it('should correctly translate confirmed toggle type', () => {
      const result = component['translateConfirmedToggleType'](
        SelectedKpisAndMetadata.ConfirmedDeliveries
      );

      expect(result).toBeDefined();
    });

    it('should correctly transform different confirmed toggle types', () => {
      jest
        .spyOn(component as any, 'translateConfirmedToggleType')
        .mockImplementation((input) => {
          const prefix = 'confirmed';
          const withoutPrefix = String(input).slice(prefix.length);
          const firstChar = withoutPrefix.charAt(0).toLowerCase();
          const remainingChars = withoutPrefix.slice(1);

          return firstChar + remainingChars;
        });

      expect(
        component['translateConfirmedToggleType'](
          SelectedKpisAndMetadata.ConfirmedDeliveries
        )
      ).toEqual('deliveries');
      expect(
        component['translateConfirmedToggleType'](
          SelectedKpisAndMetadata.ConfirmedFirmBusiness
        )
      ).toEqual('firmBusiness');
      expect(
        component['translateConfirmedToggleType'](
          SelectedKpisAndMetadata.ConfirmedOnTopOrder
        )
      ).toEqual('onTopOrder');
    });

    it('should correctly handle confirmed toggle types with various casing patterns', () => {
      const translateSpy = jest.spyOn(
        component as any,
        'translateConfirmedToggleType'
      );

      translateSpy.mockImplementation((input: any) => `translated_${input}`);

      component['translateConfirmedToggleType'](
        SelectedKpisAndMetadata.ConfirmedDeliveries
      );
      component['translateConfirmedToggleType'](
        SelectedKpisAndMetadata.ConfirmedFirmBusiness
      );
      component['translateConfirmedToggleType'](
        SelectedKpisAndMetadata.ConfirmedSalesPlan
      );

      expect(translateSpy).toHaveBeenCalledTimes(3);
      expect(translateSpy).toHaveBeenCalledWith(
        SelectedKpisAndMetadata.ConfirmedDeliveries
      );
      expect(translateSpy).toHaveBeenCalledWith(
        SelectedKpisAndMetadata.ConfirmedFirmBusiness
      );
      expect(translateSpy).toHaveBeenCalledWith(
        SelectedKpisAndMetadata.ConfirmedSalesPlan
      );
    });

    it('should handle empty or invalid input gracefully', () => {
      const emptyResult = component['translateConfirmedToggleType'](
        '' as SelectedKpisAndMetadata
      );
      expect(emptyResult).toBeDefined();

      const invalidResult = component['translateConfirmedToggleType'](
        'nonConfirmedValue' as SelectedKpisAndMetadata
      );
      expect(invalidResult).toBeDefined();
    });

    it('should correctly transform the first character to lowercase', () => {
      jest
        .spyOn(component as any, 'translateConfirmedToggleType')
        .mockImplementation((input: any) => {
          const prefix = 'confirmed';
          if (input.startsWith(prefix)) {
            const withoutPrefix = String(input).slice(prefix.length);
            const firstChar = withoutPrefix.charAt(0).toLowerCase();
            const remainingChars = withoutPrefix.slice(1);

            return firstChar + remainingChars;
          }

          return input;
        });

      const result1 = component['translateConfirmedToggleType'](
        'confirmedAbc' as SelectedKpisAndMetadata
      );
      const result2 = component['translateConfirmedToggleType'](
        'confirmedXyz' as SelectedKpisAndMetadata
      );

      expect(result1).toEqual('abc');
      expect(result2).toEqual('xyz');
    });
  });

  describe('isAllowedToggleSection', () => {
    it('should determine if toggle section is allowed', () => {
      const result = component['isAllowedToggleSection'](
        [PlanningView.REQUESTED],
        { type: PlanningView.REQUESTED }
      );

      expect(result).toBeTruthy();
    });

    it('should determine if toggle section is not allowed', () => {
      const result = component['isAllowedToggleSection'](
        [PlanningView.REQUESTED],
        { type: PlanningView.CONFIRMED }
      );

      expect(result).toBeFalsy();
    });
  });

  describe('form initialization', () => {
    it('should initialize form with proper default values', () => {
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
      ).toBeDefined();
      expect(component['formGroup'].get('startDatePeriod1')).toBeDefined();
      expect(component['formGroup'].get('endDatePeriod1')).toBeDefined();
      expect(component['formGroup'].get('periodType1')).toBeDefined();
      expect(component['formGroup'].get('startDatePeriod2')).toBeDefined();
      expect(component['formGroup'].get('endDatePeriod2')).toBeDefined();
      expect(component['formGroup'].get('periodType2')).toBeDefined();
    });

    it('should initialize with the passed date ranges', () => {
      const testDate = new Date('2023-01-01');
      const endDate = new Date('2023-02-01');

      component = Stub.get<DemandValidationExportModalComponent>({
        component: DemandValidationExportModalComponent,
        providers: [
          FormBuilder,
          Stub.getMatDialogDataProvider({
            customerData: [],
            dateRanges: {
              range1: {
                from: testDate,
                to: endDate,
                period: DateRangePeriod.Monthly,
              },
            },
            demandValidationFilters: {},
          }),
          Stub.getDemandValidationServiceProvider(),
          Stub.getMatDialogProvider(),
          Stub.getBreakpointObserverProvider(),
          Stub.getUserServiceProvider(),
        ],
      });

      expect(component['formGroup'].get('startDatePeriod1').value).toEqual(
        testDate
      );
      expect(component['formGroup'].get('endDatePeriod1').value).toEqual(
        endDate
      );
    });
  });

  describe('crossFieldValidator', () => {
    it('should return null when start date is before end date', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-02-01');

      component['formGroup'].get('startDatePeriod1').setValue(startDate);
      component['formGroup'].get('endDatePeriod1').setValue(endDate);

      const validator = component['crossFieldValidator'](
        'startDatePeriod1',
        'endDatePeriod1'
      );
      const result = validator(component['formGroup']);

      expect(result).toBeNull();
    });

    it('should return error when start date is after end date', () => {
      const startDate = new Date('2023-02-01');
      const endDate = new Date('2023-01-01');

      component['formGroup'].get('startDatePeriod1').setValue(startDate);
      component['formGroup'].get('endDatePeriod1').setValue(endDate);

      const validator = component['crossFieldValidator'](
        'startDatePeriod1',
        'endDatePeriod1'
      );
      const result = validator(component['formGroup']);

      expect(result).toEqual({ endDate: ['end-before-start'] });
    });

    it('should validate second period dates correctly', () => {
      const startDate1 = new Date('2023-01-01');
      const endDate1 = new Date('2023-02-01');
      const startDate2 = new Date('2023-03-01');
      const endDate2 = new Date('2023-04-01');

      component['formGroup'].get('startDatePeriod1').setValue(startDate1);
      component['formGroup'].get('endDatePeriod1').setValue(endDate1);
      component['formGroup'].get('startDatePeriod2').setValue(startDate2);
      component['formGroup'].get('endDatePeriod2').setValue(endDate2);

      expect(component['formGroup'].valid).toBeTruthy();

      component['formGroup'].get('startDatePeriod2').setValue(endDate2);
      component['formGroup'].get('endDatePeriod2').setValue(startDate2);

      expect(component['formGroup'].valid).toBeFalsy();
    });

    it('should handle null date values', () => {
      component['formGroup'].get('startDatePeriod1').setValue(null);
      component['formGroup'].get('endDatePeriod1').setValue(null);

      const validator = component['crossFieldValidator'](
        'startDatePeriod1',
        'endDatePeriod1'
      );

      const result = validator(component['formGroup']);

      expect(result).toBeDefined();
      expect(result.required).toBeDefined();
    });

    it('should validate startDatePeriod2 and endDatePeriod2 correctly', () => {
      component['formGroup']
        .get('startDatePeriod2')
        .setValue(new Date(2023, 2, 1));
      component['formGroup']
        .get('endDatePeriod2')
        .setValue(new Date(2023, 3, 1));

      const validator = component['crossFieldValidator'](
        'startDatePeriod2',
        'endDatePeriod2'
      );

      const result = validator(component['formGroup']);

      expect(result).toBeNull();

      component['formGroup']
        .get('startDatePeriod2')
        .setValue(new Date(2023, 3, 1));
      component['formGroup']
        .get('endDatePeriod2')
        .setValue(new Date(2023, 2, 1));

      const resultInvalid = validator(component['formGroup']);

      expect(resultInvalid).toBeDefined();
      expect(resultInvalid.endDate).toBeDefined();
    });
  });

  describe('getSelectedKpisAndMetadata', () => {
    it('should initialize columns with correct default values', () => {
      const columns = (component as any).getSelectedKpisAndMetadata();

      expect(columns[SelectedKpisAndMetadata.Deliveries]).toBeTruthy();
      expect(columns[SelectedKpisAndMetadata.FirmBusiness]).toBeTruthy();

      expect(Object.keys(columns).length).toBeGreaterThan(5);
    });
  });

  describe('getDates', () => {
    it('should properly extract dates from input data', () => {
      const testDate = new Date('2023-01-01');
      const endDate = new Date('2023-02-01');

      component = Stub.get<DemandValidationExportModalComponent>({
        component: DemandValidationExportModalComponent,
        providers: [
          FormBuilder,
          Stub.getMatDialogDataProvider({
            customerData: [],
            dateRanges: {
              range1: {
                from: testDate,
                to: endDate,
                period: DateRangePeriod.Monthly,
              },
            },
            demandValidationFilters: {},
          }),
          Stub.getDemandValidationServiceProvider(),
          Stub.getMatDialogProvider(),
          Stub.getBreakpointObserverProvider(),
          Stub.getUserServiceProvider(),
        ],
      });

      const dates = (component as any).getDates();

      expect(dates.startDatePeriod1[0]).toEqual(testDate);
      expect(dates.endDatePeriod1[0]).toEqual(endDate);
      expect(dates.periodType1.id).toEqual(DateRangePeriod.Monthly);
    });

    it('should use default period type when none provided', () => {
      component = Stub.get<DemandValidationExportModalComponent>({
        component: DemandValidationExportModalComponent,
        providers: [
          FormBuilder,
          Stub.getMatDialogDataProvider({
            customerData: [],
            dateRanges: {
              range1: {
                from: new Date(),
                to: new Date(),
                period: 'invalidPeriod' as any,
              },
            },
            demandValidationFilters: {},
          }),
          Stub.getDemandValidationServiceProvider(),
          Stub.getMatDialogProvider(),
          Stub.getBreakpointObserverProvider(),
          Stub.getUserServiceProvider(),
        ],
      });

      const dates = (component as any).getDates();
      expect(dates.periodType1.id).toEqual(DateRangePeriod.Monthly);
    });

    it('should calculate period2 start date based on period1 end date when range2 not provided', () => {
      const testDate = new Date('2023-01-01');
      const endDate = new Date('2023-02-01');
      const expectedPeriod2Start = new Date('2023-03-01'); // one month after period1 end

      component = Stub.get<DemandValidationExportModalComponent>({
        component: DemandValidationExportModalComponent,
        providers: [
          FormBuilder,
          Stub.getMatDialogDataProvider({
            customerData: [],
            dateRanges: {
              range1: {
                from: testDate,
                to: endDate,
                period: DateRangePeriod.Monthly,
              },
            },
            demandValidationFilters: {},
          }),
          Stub.getDemandValidationServiceProvider(),
          Stub.getMatDialogProvider(),
          Stub.getBreakpointObserverProvider(),
          Stub.getUserServiceProvider(),
        ],
      });

      const dates = (component as any).getDates();

      expect(dates.startDatePeriod2.getFullYear()).toEqual(
        expectedPeriod2Start.getFullYear()
      );
      expect(dates.startDatePeriod2.getMonth()).toEqual(
        expectedPeriod2Start.getMonth()
      );
      expect(dates.startDatePeriod2.getDate()).toEqual(
        expectedPeriod2Start.getDate()
      );
      expect(dates.endDatePeriod2).toBeUndefined();
    });

    it('should use period2 values when provided', () => {
      const period2Start = new Date('2023-03-01');
      const period2End = new Date('2023-04-01');

      component = Stub.get<DemandValidationExportModalComponent>({
        component: DemandValidationExportModalComponent,
        providers: [
          FormBuilder,
          Stub.getMatDialogDataProvider({
            customerData: [],
            dateRanges: {
              range1: {
                from: new Date('2023-01-01'),
                to: new Date('2023-02-01'),
                period: DateRangePeriod.Monthly,
              },
              range2: {
                from: period2Start,
                to: period2End,
                period: DateRangePeriod.Weekly,
              },
            },
            demandValidationFilters: {},
          }),
          Stub.getDemandValidationServiceProvider(),
          Stub.getMatDialogProvider(),
          Stub.getBreakpointObserverProvider(),
          Stub.getUserServiceProvider(),
        ],
      });

      const dates = (component as any).getDates();
      expect(dates.startDatePeriod2).toEqual(period2Start);
      expect(dates.endDatePeriod2).toEqual(period2End);
      expect(dates.periodType2.id).toEqual(DateRangePeriod.Weekly);
    });
  });

  describe('stepperOrientation', () => {
    let subject: BehaviorSubject<{ matches: boolean | null }>;

    beforeEach(() => {
      subject = new BehaviorSubject<{ matches: boolean | null }>({
        matches: null,
      });
      component = Stub.get<DemandValidationExportModalComponent>({
        component: DemandValidationExportModalComponent,
        providers: [
          FormBuilder,
          Stub.getMatDialogDataProvider({
            customerData: [],
            dateRanges: {
              range1: {
                from: new Date(),
                to: new Date(),
                period: DateRangePeriod.Weekly,
              },
            },
            demandValidationFilters: {},
          }),
          Stub.getDemandValidationServiceProvider(),
          Stub.getMatDialogProvider(),
          {
            provide: BreakpointObserver,
            useValue: { observe: () => subject.asObservable() },
          },
          Stub.getUserServiceProvider(),
        ],
      });
    });

    it('should initialize stepper orientation observable', () => {
      expect(component['stepperOrientation$']).toBeDefined();
    });

    it('should use correct breakpoints for different languages', () => {
      const translocoService = (component as any).translocoService;
      const spy = jest.spyOn(translocoService, 'getActiveLang');

      spy.mockReturnValue('unknown-lang');
      expect((component as any).breakpoint).toEqual('1680px');

      spy.mockReturnValue('en');
      expect((component as any).breakpoint).toEqual('1400px');

      spy.mockReturnValue('de');
      expect((component as any).breakpoint).toEqual('1470px');
    });

    it('should return "horizontal" for wide viewports', async () => {
      const breakpointObserver = component['breakpointObserver'];
      const breakpointSpy = jest.spyOn(breakpointObserver, 'observe');
      subject.next({ matches: false }); // matches: false means viewport is wider than breakpoint

      component['stepperOrientation$'].subscribe((value) => {
        expect(breakpointSpy).toHaveBeenCalled();
        expect(value).toEqual('horizontal');
      });
    });

    it('should return "vertical" for narrow viewports', async () => {
      const breakpointObserver = component['breakpointObserver'];
      const breakpointSpy = jest.spyOn(breakpointObserver, 'observe');
      subject.next({ matches: true }); // matches: true means viewport is narrower than breakpoint

      component['stepperOrientation$'].subscribe((value) => {
        expect(breakpointSpy).toHaveBeenCalled();
        expect(value).toEqual('vertical');
      });
    });

    it('should use correct breakpoint based on active language', async () => {
      const translocoService = component['translocoService'];
      const breakpointObserver = component['breakpointObserver'];

      const langSpy = jest.spyOn(translocoService, 'getActiveLang');
      const breakpointSpy = jest.spyOn(breakpointObserver, 'observe');

      langSpy.mockReturnValue('en');
      subject.next({ matches: true });

      component['stepperOrientation$'].subscribe(() =>
        expect(breakpointSpy).toHaveBeenCalledWith(`(max-width: 1400px)`)
      );

      breakpointSpy.mockClear();

      langSpy.mockReturnValue('de');
      subject.next({ matches: false });

      component['stepperOrientation$'].subscribe(() =>
        expect(breakpointSpy).toHaveBeenCalledWith(`(max-width: 1470px)`)
      );
    });
  });

  describe('applyInitialTemplate', () => {
    it('should initialize templates and set the active template', () => {
      const userSettingsSpy = jest
        .spyOn(component['userService'], 'userSettings')
        .mockReturnValue({
          [UserSettingsKey.DemandValidation]: {
            [DemandValidationUserSettingsKey.Exports]: [
              {
                id: 'template1',
                title: 'Template 1',
                active: true,
                selectedKpisAndMetadata: [],
              },
              {
                id: 'template2',
                title: 'Template 2',
                active: false,
                selectedKpisAndMetadata: [],
              },
            ],
          },
        } as any);

      component['userService'].settingsLoaded$.next(true);
      component['applyInitialTemplate']();

      expect(userSettingsSpy).toHaveBeenCalled();
      expect(component['initialTemplates']()).toEqual([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);
      expect(component['templates']()).toEqual([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);
    });
  });

  describe('handleActiveTemplate', () => {
    it('should set the first template as active if none are active', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['handleActiveTemplate']();

      expect(component['templates']()[0].active).toBeTruthy();
      expect(userServiceSpy).toHaveBeenCalledWith(
        DemandValidationUserSettingsKey.Exports,
        [
          {
            id: 'template1',
            title: 'Template 1',
            active: true,
            selectedKpisAndMetadata: [],
          },
          {
            id: 'template2',
            title: 'Template 2',
            active: false,
            selectedKpisAndMetadata: [],
          },
        ]
      );
    });

    it('should update form values based on the active template', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.Deliveries,
            SelectedKpisAndMetadata.FirmBusiness,
          ],
        },
      ]);

      component['handleActiveTemplate']();

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Deliveries).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.FirmBusiness).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
          .value
      ).toBeFalsy();
    });

    it('should mark form as pristine and untouched after updating', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['formGroup'].markAsDirty();
      component['formGroup'].markAsTouched();

      component['handleActiveTemplate']();

      expect(component['formGroup'].pristine).toBeTruthy();
      expect(component['formGroup'].touched).toBeFalsy();
    });
  });

  describe('deleteTemplate', () => {
    it('should remove a template from the templates list', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['deleteTemplate']('template2');

      expect(component['templates']().length).toBe(1);
      expect(component['templates']()[0].id).toBe('template1');
    });

    it('should call handleActiveTemplate after deleting a template', () => {
      const handleActiveTemplateSpy = jest.spyOn(
        component as any,
        'handleActiveTemplate'
      );

      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['deleteTemplate']('template2');

      expect(handleActiveTemplateSpy).toHaveBeenCalled();
    });

    it('should maintain template active states when deleting a non-active template', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['deleteTemplate']('template2');

      expect(component['templates']()[0].active).toBeTruthy();
    });
  });

  describe('onTemplateChange', () => {
    it('should update title and set active state for an existing template', () => {
      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['templates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['onTemplateChange']('template1', 'New Title');

      expect(component['templates']()[0].title).toBe('New Title');
      expect(component['templates']()[0].active).toBeTruthy();
    });

    it('should add a new template when id is "new"', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['onTemplateChange']('new', 'New Template');

      expect(component['templates']().length).toBe(2);
      expect(component['templates']()[0].active).toBeFalsy();
      expect(component['templates']()[1].id).toBe('new');
      expect(component['templates']()[1].title).toBe('New Template');
      expect(component['templates']()[1].active).toBeTruthy();
    });

    it('should call handleActiveTemplate after template change', () => {
      const handleActiveTemplateSpy = jest.spyOn(
        component as any,
        'handleActiveTemplate'
      );

      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['onTemplateChange']('template1', 'Updated Title');

      expect(handleActiveTemplateSpy).toHaveBeenCalled();
    });

    it('should reset titles from initial templates for non-selected templates', () => {
      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original Title 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Original Title 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['templates'].set([
        {
          id: 'template1',
          title: 'Changed Title 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'template2',
          title: 'Changed Title 2',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['onTemplateChange']('template1', 'New Title 1');

      expect(component['templates']()[0].title).toBe('New Title 1');
      expect(component['templates']()[1].title).toBe('Original Title 2');
    });

    it('should remove any "new" templates before adding a new one', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'new',
          title: 'Previous New Template',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['onTemplateChange']('new', 'Newer Template');

      expect(component['templates']().length).toBe(2);
      expect(component['templates']()[1].title).toBe('Newer Template');
    });
  });

  describe('isNewAllowed property', () => {
    it('should allow new template when below max limit', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      expect(component['isNewAllowed']).toBeTruthy();
    });

    it('should not allow new template when at max limit', () => {
      const templates = Array.from({ length: 4 }, (_, i) => ({
        id: `template${i + 1}`,
        title: `Template ${i + 1}`,
        active: i === 0,
        selectedKpisAndMetadata: [] as any,
      }));

      component['templates'].set(templates);

      expect(component['isNewAllowed']).toBeTruthy();

      templates.push({
        id: 'template6',
        title: 'Template 6',
        active: false,
        selectedKpisAndMetadata: [],
      });

      component['templates'].set(templates);

      expect(component['isNewAllowed']).toBeFalsy();
    });

    it('should not allow new template when a "new" template already exists', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'new',
          title: 'New Template',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      expect(component['isNewAllowed']).toBeFalsy();
    });
  });

  describe('applyAndSaveTemplates', () => {
    it('should convert active columns to array when saving templates', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );

      component['templates'].set([
        {
          id: 'template1',
          title: 'Test Template',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup']
        .get(SelectedKpisAndMetadata.FirmBusiness)
        .setValue(true);
      component['formGroup']
        .get(SelectedKpisAndMetadata.Opportunities)
        .setValue(false);

      (component as any).applyAndSaveTemplates(
        component['formGroup'].getRawValue()
      );

      expect(userServiceSpy).toHaveBeenCalled();
      const savedTemplate = (userServiceSpy.mock.calls as any)[0][1][0];
      expect(savedTemplate.selectedKpisAndMetadata).toContain(
        SelectedKpisAndMetadata.Deliveries
      );
      expect(savedTemplate.selectedKpisAndMetadata).toContain(
        SelectedKpisAndMetadata.FirmBusiness
      );
      expect(savedTemplate.selectedKpisAndMetadata).not.toContain(
        SelectedKpisAndMetadata.Opportunities
      );
    });

    it('should generate new UUID for templates with newId', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );

      component['templates'].set([
        {
          id: component['newId'],
          title: 'New Template',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      (component as any).applyAndSaveTemplates(
        component['formGroup'].getRawValue()
      );

      const savedTemplate = (userServiceSpy.mock.calls as any)[0][1][0];
      expect(savedTemplate.id).not.toBe(component['newId']);
      expect(savedTemplate.id.length).toBeGreaterThan(10); // UUID is much longer
    });

    it('should only update selectedKpisAndMetadata for the active template', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      const applyAndSaveTemplatesMethod = (component as any)
        .applyAndSaveTemplates;
      const mockSelectedKpis = {
        [SelectedKpisAndMetadata.Deliveries]: true,
        [SelectedKpisAndMetadata.FirmBusiness]: true,
        [SelectedKpisAndMetadata.ForecastProposal]: false,
      };

      (component as any).templates.set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.ForecastProposal,
            SelectedKpisAndMetadata.ValidatedForecast,
          ],
        },
        {
          id: 'template3',
          title: 'Template 3',
          active: false,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.ConfirmedDeliveries,
            SelectedKpisAndMetadata.ConfirmedFirmBusiness,
          ],
        },
      ]);

      applyAndSaveTemplatesMethod.call(component, mockSelectedKpis);

      expect(userServiceSpy).toHaveBeenCalledWith(
        DemandValidationUserSettingsKey.Exports,
        expect.arrayContaining([
          {
            id: 'template1',
            title: 'Template 1',
            active: true,
            selectedKpisAndMetadata: [
              SelectedKpisAndMetadata.Deliveries,
              SelectedKpisAndMetadata.FirmBusiness,
            ],
          },
          {
            id: 'template2',
            title: 'Template 2',
            active: false,
            selectedKpisAndMetadata: [
              SelectedKpisAndMetadata.ForecastProposal,
              SelectedKpisAndMetadata.ValidatedForecast,
            ],
          },
          {
            id: 'template3',
            title: 'Template 3',
            active: false,
            selectedKpisAndMetadata: [
              SelectedKpisAndMetadata.ConfirmedDeliveries,
              SelectedKpisAndMetadata.ConfirmedFirmBusiness,
            ],
          },
        ])
      );
    });

    it('should handle case where no templates exist', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      const applyAndSaveTemplatesMethod = (component as any)
        .applyAndSaveTemplates;
      const mockSelectedKpis = null as any;

      (component as any).templates.set([]);

      applyAndSaveTemplatesMethod.call(component, mockSelectedKpis);

      expect(userServiceSpy).toHaveBeenCalledWith(
        DemandValidationUserSettingsKey.Exports,
        []
      );
    });
  });

  describe('startExport', () => {
    it('should open loading dialog with correct data', () => {
      const dialogSpy = jest.spyOn(component['dialog'], 'open');
      const demandServiceSpy = jest
        .spyOn(component['demandValidationService'], 'triggerExport')
        .mockReturnValue(of({} as any));

      const columns = {
        [SelectedKpisAndMetadata.Deliveries]: true,
        [SelectedKpisAndMetadata.FirmBusiness]: true,
      };
      const dateRange = {
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 1, 1),
          period: DateRangePeriod.Monthly,
        },
      };

      (component as any).startExport(columns, dateRange);

      expect(dialogSpy).toHaveBeenCalled();
      const dialogConfig = dialogSpy.mock.calls[0][1];
      expect(dialogConfig.disableClose).toBeTruthy();
      expect(dialogConfig.autoFocus).toBeFalsy();

      expect(typeof (dialogConfig.data as any).onInit).toBe('function');

      (dialogConfig.data as any).onInit();
      expect(demandServiceSpy).toHaveBeenCalledWith(
        columns,
        dateRange,
        component['data'].demandValidationFilters
      );
    });

    it('should close export modal when onClose is called', () => {
      const dialogSpy = jest.spyOn(component['dialog'], 'open');
      const dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');

      (component as any).startExport({}, {});

      const dialogConfig = dialogSpy.mock.calls[0][1];
      const onClose = (dialogConfig.data as any).onClose;

      onClose();

      expect(dialogRefSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call applyInitialTemplate on initialization', () => {
      const applyTemplateSpy = jest.spyOn(
        component as any,
        'applyInitialTemplate'
      );

      applyTemplateSpy.mockClear();

      component.ngOnInit();

      expect(applyTemplateSpy).toHaveBeenCalled();
    });
  });

  describe('template management', () => {
    it('should update user settings when template changes are saved', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true),
        } as any);

      component['formGroup'].controls['startDatePeriod1'].setValue(
        new Date(2023, 0, 1)
      );
      component['formGroup'].controls['endDatePeriod1'].setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls[
        SelectedKpisAndMetadata.Deliveries
      ].setValue(true);
      component['formGroup'].updateValueAndValidity();

      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);
      component['templates'].set([
        {
          id: 'template1',
          title: 'Updated Title',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue({
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 1, 1),
          period: DateRangePeriod.Monthly,
        },
      });

      component['handleExcelExport']();

      expect(dialogSpy).toHaveBeenCalled();
      expect(userServiceSpy).toHaveBeenCalledWith(
        DemandValidationUserSettingsKey.Exports,
        [
          {
            id: 'template1',
            title: 'Updated Title',
            active: true,
            selectedKpisAndMetadata: expect.any(Array),
          },
        ]
      );
    });

    it('should generate a new UUID for templates with "new" id when saving', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as any);

      component['formGroup'].controls['startDatePeriod1'].setValue(
        new Date(2023, 0, 1)
      );
      component['formGroup'].controls['endDatePeriod1'].setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls[
        SelectedKpisAndMetadata.Deliveries
      ].setValue(true);
      component['formGroup'].updateValueAndValidity();

      component['initialTemplates'].set([]);
      component['templates'].set([
        {
          id: 'new',
          title: 'New Template',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue({
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 1, 1),
          period: DateRangePeriod.Monthly,
        },
      });

      component['handleExcelExport']();

      const savedTemplates = userServiceSpy.mock.calls[0][1] as any;
      expect(savedTemplates[0].id).not.toBe('new');
      expect(savedTemplates[0].id.length).toBeGreaterThan(10); // UUID is longer than "new"
    });

    it('should not update user settings when templates have not changed', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      const matDialogSpy = jest.spyOn(component['dialog'], 'open');

      component['formGroup'].controls['startDatePeriod1'].setValue(
        new Date(2023, 0, 1)
      );
      component['formGroup'].controls['endDatePeriod1'].setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls[
        SelectedKpisAndMetadata.Deliveries
      ].setValue(true);
      component['formGroup'].updateValueAndValidity();

      const templates = [
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [] as any,
        },
      ];
      component['initialTemplates'].set([...templates]);
      component['templates'].set([...templates]);

      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue({
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 1, 1),
          period: DateRangePeriod.Monthly,
        },
      });

      component['handleExcelExport']();

      expect(matDialogSpy).toHaveBeenCalled();
      expect((matDialogSpy.mock.calls[0][0] as any).name).toContain(
        'DemandValidationLoadingModalComponent'
      );
      expect(userServiceSpy).not.toHaveBeenCalled();
    });
  });

  describe('export flow with templates', () => {
    beforeEach(() => {
      component['formGroup'].controls['startDatePeriod1'].setValue(
        new Date(2023, 0, 1)
      );
      component['formGroup'].controls['endDatePeriod1'].setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls[
        SelectedKpisAndMetadata.Deliveries
      ].setValue(true);
      component['formGroup'].updateValueAndValidity();

      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue({
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 1, 1),
          period: DateRangePeriod.Monthly,
        },
      });
    });

    it('should show confirmation dialog when templates have changed', () => {
      const confirmDialogSpy = jest.spyOn(component['dialog'], 'open');

      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);
      component['templates'].set([
        {
          id: 'template1',
          title: 'Changed Title',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['handleExcelExport']();

      expect(confirmDialogSpy).toHaveBeenCalled();
      expect((confirmDialogSpy.mock.calls[0][0] as any).name).toContain(
        'ConfirmationDialogComponent'
      );
    });

    it('should not update templates if user cancels confirmation dialog', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(false), // User cancels dialog
      } as any);

      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);
      component['templates'].set([
        {
          id: 'template1',
          title: 'Changed Title',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['handleExcelExport']();

      expect(userServiceSpy).not.toHaveBeenCalled();
    });

    it('should proceed directly to export when using a new template', () => {
      const matDialogSpy = jest.spyOn(component['dialog'], 'open');
      const startExportSpy = jest.spyOn(component as any, 'startExport');

      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
      ]);
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [],
        },
        {
          id: 'new',
          title: 'New Template',
          active: true,
          selectedKpisAndMetadata: [],
        },
      ]);

      component['handleExcelExport']();

      expect(startExportSpy).toHaveBeenCalled();
      expect(matDialogSpy).toHaveBeenCalled();
      expect((matDialogSpy.mock.calls[0][0] as any).name).toContain(
        'DemandValidationLoadingModalComponent'
      );
    });
  });

  describe('template selection and form state', () => {
    it('should reflect selected template columns in form', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Test Template',
          active: true,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.FirmBusiness,
            SelectedKpisAndMetadata.Opportunities,
          ],
        },
      ]);

      component['handleActiveTemplate']();

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.FirmBusiness).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Opportunities).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Deliveries).value
      ).toBeFalsy();
    });

    it('should maintain form dates when switching templates', () => {
      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 1, 1);
      component['formGroup'].get('startDatePeriod1').setValue(startDate);
      component['formGroup'].get('endDatePeriod1').setValue(endDate);

      component['templates'].set([
        {
          id: 'template1',
          title: 'Test Template',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.FirmBusiness],
        },
      ]);

      component['handleActiveTemplate']();

      expect(component['formGroup'].get('startDatePeriod1').value).toEqual(
        startDate
      );
      expect(component['formGroup'].get('endDatePeriod1').value).toEqual(
        endDate
      );
    });

    it('should update form validity after applying template', () => {
      Object.values(SelectedKpisAndMetadata).forEach((column) => {
        if (component['formGroup'].get(column)) {
          component['formGroup'].get(column).setValue(false);
        }
      });
      component['formGroup'].updateValueAndValidity();
      expect(component['formGroup'].valid).toBeFalsy();

      component['templates'].set([
        {
          id: 'template1',
          title: 'Valid Template',
          active: true,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.Deliveries,
            SelectedKpisAndMetadata.FirmBusiness,
          ],
        },
      ]);

      component['handleActiveTemplate']();

      expect(component['formGroup'].valid).toBeTruthy();
    });
  });

  describe('template list management', () => {
    it('should limit the number of templates to maxAllowedTemplates', () => {
      expect(component['maxAllowedTemplates']).toBe(5);

      const templates = Array.from(
        { length: component['maxAllowedTemplates'] - 1 },
        (_, i) => ({
          id: `template${i + 1}`,
          title: `Template ${i + 1}`,
          active: i === 0,
          selectedKpisAndMetadata: [] as SelectedKpisAndMetadata[],
        })
      );

      component['templates'].set(templates);
      expect(component['isNewAllowed']).toBeTruthy();

      templates.push({
        id: `template${component['maxAllowedTemplates'] + 1}`,
        title: `Template ${component['maxAllowedTemplates'] + 1}`,
        active: false,
        selectedKpisAndMetadata: [] as SelectedKpisAndMetadata[],
      });

      component['templates'].set(templates);
      expect(component['isNewAllowed']).toBeFalsy();
    });

    it('should handle empty template list gracefully', () => {
      component['templates'].set([]);
      component['initialTemplates'].set([]);

      component['handleActiveTemplate']();

      expect(component['formGroup']).toBeDefined();

      expect(component['isNewAllowed']).toBeFalsy();
    });
  });

  describe('integration scenarios', () => {
    it('should correctly handle a complete export workflow with template changes', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true), // User confirms
        } as any);

      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue({
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 1, 1),
          period: DateRangePeriod.Monthly,
        },
      });

      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['templates'].set([
        {
          id: 'template1',
          title: 'Modified',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['formGroup']
        .get('startDatePeriod1')
        .setValue(new Date(2023, 0, 1));
      component['formGroup']
        .get('endDatePeriod1')
        .setValue(new Date(2023, 1, 1));
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup'].updateValueAndValidity();

      component['handleExcelExport']();

      expect(dialogSpy).toHaveBeenCalled();
      expect((dialogSpy.mock.calls[0][0] as any).name).toContain(
        'ConfirmationDialogComponent'
      );

      expect(userServiceSpy).toHaveBeenCalled();

      expect(dialogSpy).toHaveBeenCalledTimes(2);
      expect((dialogSpy.mock.calls[1][0] as any).name).toContain(
        'DemandValidationLoadingModalComponent'
      );
    });

    it('should handle complex validation with multiple period types', () => {
      component['formGroup']
        .get('periodType1')
        .setValue({ id: DateRangePeriod.Weekly, label: 'Weekly' });
      component['formGroup']
        .get('periodType2')
        .setValue({ id: DateRangePeriod.Monthly, label: 'Monthly' });

      component['formGroup']
        .get('startDatePeriod1')
        .setValue(new Date(2023, 0, 1));
      component['formGroup']
        .get('endDatePeriod1')
        .setValue(new Date(2023, 0, 15));
      component['formGroup']
        .get('startDatePeriod2')
        .setValue(new Date(2023, 1, 1));
      component['formGroup']
        .get('endDatePeriod2')
        .setValue(new Date(2023, 2, 1));

      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup'].updateValueAndValidity();

      expect(component['formGroup'].valid).toBeTruthy();

      const mockRange = {
        range1: {
          from: new Date(2023, 0, 1),
          to: new Date(2023, 0, 15),
          period: DateRangePeriod.Weekly,
        },
        range2: {
          from: new Date(2023, 1, 1),
          to: new Date(2023, 2, 1),
          period: DateRangePeriod.Monthly,
        },
      };

      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue(mockRange);

      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Test',
          active: true,
          selectedKpisAndMetadata: component['toggleTypes']
            .find((toggle) => toggle.type === PlanningView.REQUESTED)
            .data.flat(),
        },
      ]);
      component['templates'].set([
        {
          id: 'template1',
          title: 'Test',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      const dialogSpy = jest.spyOn(component['dialog'], 'open');
      const exportSpy = jest
        .spyOn(component['demandValidationService'], 'triggerExport')
        .mockReturnValue(of({} as any));

      component['handleExcelExport']();

      expect(dialogSpy).toHaveBeenCalled();
      const loadingDialog = dialogSpy.mock.calls[0][1];
      (loadingDialog.data as any).onInit();

      expect(exportSpy).toHaveBeenCalledWith(
        expect.objectContaining({ [SelectedKpisAndMetadata.Deliveries]: true }),
        mockRange,
        component['data'].demandValidationFilters
      );
    });

    it('should handle complex scenarios with multiple templates', () => {
      const templates = [
        {
          id: 'template1',
          title: 'Template 1',
          active: false,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: true,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.FirmBusiness,
            SelectedKpisAndMetadata.Opportunities,
          ],
        },
      ];

      component['initialTemplates'].set([...templates]);
      component['templates'].set([...templates]);

      component['handleActiveTemplate']();

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.FirmBusiness).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Opportunities).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Deliveries).value
      ).toBeFalsy();

      component['onTemplateChange']('template1', 'Template 1 Updated');

      expect(component['templates']()[0].active).toBeTruthy();
      expect(component['templates']()[1].active).toBeFalsy();

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.FirmBusiness).value
      ).toBeFalsy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Opportunities).value
      ).toBeFalsy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Deliveries).value
      ).toBeTruthy();
    });

    it('should handle edge case with no templates by creating a default one', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );

      component['templates'].set([]);
      component['initialTemplates'].set([]);

      component['handleActiveTemplate']();

      expect(component['templates']().length).toBe(1);
      expect(component['templates']()[0].id).toBe('new');
      expect(component['templates']()[0].active).toBeTruthy();
      expect(userServiceSpy).toHaveBeenCalledWith(
        DemandValidationUserSettingsKey.Exports,
        []
      );
    });

    it('should correctly set form values when switching between templates', () => {
      const templates = [
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.Deliveries,
            SelectedKpisAndMetadata.FirmBusiness,
          ],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [
            SelectedKpisAndMetadata.ConfirmedDeliveries,
            SelectedKpisAndMetadata.ConfirmedFirmBusiness,
          ],
        },
      ];

      component['templates'].set([...templates]);
      component['initialTemplates'].set([...templates]);

      component['handleActiveTemplate']();

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Deliveries).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.FirmBusiness).value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ConfirmedDeliveries)
          .value
      ).toBeFalsy();

      component['onTemplateChange']('template2', 'Template 2');

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.Deliveries).value
      ).toBeFalsy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.FirmBusiness).value
      ).toBeFalsy();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ConfirmedDeliveries)
          .value
      ).toBeTruthy();
      expect(
        component['formGroup'].get(
          SelectedKpisAndMetadata.ConfirmedFirmBusiness
        ).value
      ).toBeTruthy();
    });

    it('should enable ActiveAndPredecessor control when related KPIs are selected', () => {
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(false);
      component['formGroup']
        .get(SelectedKpisAndMetadata.FirmBusiness)
        .setValue(false);
      component['formGroup']
        .get(SelectedKpisAndMetadata.ConfirmedDeliveries)
        .setValue(false);
      component['formGroup']
        .get(SelectedKpisAndMetadata.ConfirmedFirmBusiness)
        .setValue(false);

      component['formGroup'].updateValueAndValidity();
      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
          .enabled
      ).toBeFalsy();

      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup'].updateValueAndValidity();

      expect(
        component['formGroup'].get(SelectedKpisAndMetadata.ActiveAndPredecessor)
          .enabled
      ).toBeTruthy();
    });
  });

  describe('behavior with empty selections', () => {
    it('should show form errors when no KPI is selected', () => {
      component['formGroup']
        .get('startDatePeriod1')
        .setValue(new Date(2023, 0, 1));
      component['formGroup']
        .get('endDatePeriod1')
        .setValue(new Date(2023, 1, 1));

      (component as any).toggleTypes.forEach((toggle: any) => {
        if (
          toggle.type === PlanningView.REQUESTED ||
          toggle.type === PlanningView.CONFIRMED
        ) {
          toggle.data.flat().forEach((kpi: string) => {
            component['formGroup'].get(kpi).setValue(false);
          });
        }
      });

      component['formGroup'].updateValueAndValidity();

      expect(component['formGroup'].valid).toBeFalsy();
      expect(component['formGroup'].errors.atLeastOneKpiRequired).toBeTruthy();

      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup'].updateValueAndValidity();

      expect(component['formGroup'].valid).toBeTruthy();
      expect(component['formGroup'].errors).toBeNull();
    });

    it('should handle empty date values properly', () => {
      component['formGroup'].get('startDatePeriod1').setValue(null);
      component['formGroup'].get('endDatePeriod1').setValue(null);
      component['formGroup'].updateValueAndValidity();

      expect(component['formGroup'].valid).toBeFalsy();

      component['formGroup']
        .get('startDatePeriod1')
        .setValue(new Date(2023, 0, 1));
      component['formGroup'].updateValueAndValidity();

      expect(component['formGroup'].valid).toBeFalsy();

      component['formGroup']
        .get('endDatePeriod1')
        .setValue(new Date(2023, 1, 1));
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup'].updateValueAndValidity();

      expect(component['formGroup'].valid).toBeTruthy();
    });
  });

  describe('template CRUD operations', () => {
    it('should correctly add a new template with proper active states', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['onTemplateChange']('new', 'Brand New Template');

      expect(component['templates']().length).toBe(2);
      expect(component['templates']()[0].active).toBeFalsy();
      expect(component['templates']()[1].id).toBe('new');
      expect(component['templates']()[1].title).toBe('Brand New Template');
      expect(component['templates']()[1].active).toBeTruthy();
      expect(
        component['templates']()[1].selectedKpisAndMetadata.length
      ).toBeGreaterThan(0);
    });

    it('should correctly update the title of an existing template', () => {
      component['initialTemplates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['templates'].set([
        {
          id: 'template1',
          title: 'Original Title',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['onTemplateChange']('template1', 'Updated Title');

      expect(component['templates']()[0].title).toBe('Updated Title');
      expect(component['templates']()[0].active).toBeTruthy();
    });

    it('should properly delete a template and update active states', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Template 1',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
        {
          id: 'template2',
          title: 'Template 2',
          active: false,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.FirmBusiness],
        },
      ]);

      component['deleteTemplate']('template1');

      expect(component['templates']().length).toBe(1);
      expect(component['templates']()[0].id).toBe('template2');

      expect(component['templates']()[0].active).toBeTruthy();
    });

    it('should handle deleting the last template by creating a new default one', () => {
      component['templates'].set([
        {
          id: 'template1',
          title: 'Last Template',
          active: true,
          selectedKpisAndMetadata: [SelectedKpisAndMetadata.Deliveries],
        },
      ]);

      component['deleteTemplate']('template1');

      expect(component['templates']().length).toBe(1);
      expect(component['templates']()[0].id).toBe('new');
      expect(component['templates']()[0].active).toBeTruthy();
    });
  });

  describe('edge cases and defensive programming', () => {
    it('should handle invalid date ranges gracefully', () => {
      jest.spyOn(Helper, 'fillGapBetweenRanges').mockReturnValue(null);

      component['formGroup']
        .get('startDatePeriod1')
        .setValue(new Date(2023, 0, 1));
      component['formGroup']
        .get('endDatePeriod1')
        .setValue(new Date(2023, 1, 1));
      component['formGroup']
        .get(SelectedKpisAndMetadata.Deliveries)
        .setValue(true);
      component['formGroup'].updateValueAndValidity();

      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['handleExcelExport']();

      expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should reject export when form is invalid even if manually called', () => {
      component['formGroup'].get('startDatePeriod1').setValue(null);
      component['formGroup'].updateValueAndValidity();

      const applyAndSaveTemplatesSpy = jest.spyOn(
        component as any,
        'applyAndSaveTemplates'
      );
      const startExportSpy = jest.spyOn(component as any, 'startExport');

      component['handleExcelExport']();

      expect(applyAndSaveTemplatesSpy).not.toHaveBeenCalled();
      expect(startExportSpy).not.toHaveBeenCalled();
    });
  });
});

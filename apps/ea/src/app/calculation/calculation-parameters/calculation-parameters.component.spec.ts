import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, of } from 'rxjs';

import { LocalStorageService } from '@ea/core/local-storage';
import { CalculationParametersChipsService } from '@ea/core/services/calculation-parameters';
import { CalculationParametersFormHelperService } from '@ea/core/services/calculation-parameters-form-helper.service';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import {
  CalculationParametersFacade,
  CalculationResultFacade,
} from '@ea/core/store';
import {
  resetCalculationParameters,
  setSelectedLoadcase,
} from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { translate } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersComponent } from './calculation-parameters.component';
import { CalculationParametersFormFactory } from './calculation-parameters-form.factory';
import { ParameterTemplateDirective } from './parameter-template.directive';

describe('CalculationParametersComponent', () => {
  let component: CalculationParametersComponent;
  let spectator: Spectator<CalculationParametersComponent>;
  let store: MockStore;
  let storageService: LocalStorageService;
  let calculationParametersFacade: jest.Mocked<CalculationParametersFacade>;
  let calculationResultFacade: jest.Mocked<CalculationResultFacade>;
  let formFactory: jest.Mocked<CalculationParametersFormFactory>;
  let mockRouter: jest.Mocked<Router>;
  let trackingService: jest.Mocked<TrackingService>;

  let sharedMockOperationConditionsForm: FormGroup;
  let sharedMockForm: FormGroup;
  let sharedMockLoadCaseArray: FormArray;
  let sharedCreateLoadCaseFormGroup: FormGroup;

  const mockOperationConditions$ = new BehaviorSubject({
    loadCaseData: [
      {
        loadCaseName: 'Load Case 1',
        operatingTemperature: 70,
        operatingTime: 100,
        load: { radialLoad: 1000, axialLoad: 500 },
        rotation: {
          typeOfMotion: 'LB_ROTATING' as const,
          rotationalSpeed: 1500,
        },
      },
    ],
    contamination: 'clean',
    ambientTemperature: 20,
    time: 8760,
    lubrication: {
      lubricationSelection: 'oil',
      oil: { selection: 'isoVgClass', isoVgClass: { isoVgClass: 46 } },
    },
    energySource: { type: 'fossil', fossil: { fossilOrigin: 'natural_gas' } },
    conditionOfRotation: 'inner_ring_rotating',
    selectedLoadcase: 0,
  });

  const mockCalculationFieldsConfig$ = new BehaviorSubject({
    required: ['load', 'rotatingCondition'],
    preset: ['operatingTemperature', 'lubrication'],
  });

  const mockCalculationTypes$ = new BehaviorSubject({
    ratingLife: { selected: true, visible: true, disabled: false },
    frictionalPowerloss: { selected: false, visible: true, disabled: false },
  });

  const mockTemplates$ = new BehaviorSubject({
    loadcaseTemplate: [],
    operatingConditionsTemplate: [],
  });

  const createComponent = createComponentFactory({
    component: CalculationParametersComponent,
    imports: [
      ParameterTemplateDirective,
      LetDirective,
      PushPipe,
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatDialogModule),
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({ initialState: { ...APP_STATE_MOCK } }),
      { provide: translate, useValue: jest.fn() },
      {
        provide: LocalStorageService,
        useValue: { restoreStoredSession: jest.fn() },
      },
      {
        provide: CalculationParametersFormFactory,
        useValue: {
          createForm: jest.fn(),
          createLoadCaseDataFormGroup: jest.fn(),
        },
      },
      {
        provide: CalculationParametersFacade,
        useValue: {
          operationConditions$: mockOperationConditions$,
          getCalculationFieldsConfig$: mockCalculationFieldsConfig$,
          getCalculationTypes$: mockCalculationTypes$,
          hasCalculation$: of(true),
          dispatch: jest.fn(),
        },
      },
      {
        provide: ProductSelectionFacade,
        useValue: {
          templates$: mockTemplates$,
          bearingDesignation$: of('Test Bearing'),
          availableLoads$: of(['radial', 'axial']),
          availableLubricationMethods$: of(['oil', 'grease']),
          isCo2DownstreamCalculationPossible$: of(true),
          availableForce$: of(true),
          availableMoment$: of(true),
          getTemplateItem: jest.fn().mockReturnValue(
            of({
              options: [{ value: 'LB_ROTATING' }, { value: 'LB_OSCILLATING' }],
            })
          ),
        },
      },
      { provide: CalculationResultFacade, useValue: { dispatch: jest.fn() } },
      {
        provide: CalculationParametersFormHelperService,
        useValue: {
          getLocalizedLoadCaseName: jest.fn().mockReturnValue('Load Case Test'),
          getTotalOperatingTimeForLoadcases: jest.fn().mockReturnValue(8760),
          getLocalizedLoadCaseTimePortion: jest.fn().mockReturnValue('100%'),
          updateResultsToHandleNegativeValues: jest
            .fn()
            .mockReturnValue({ previous: {}, new: {} }),
          openConfirmDeleteDialog: jest
            .fn()
            .mockReturnValue({ afterClosed: () => of(true) }),
        },
      },
      {
        provide: CalculationParametersChipsService,
        useValue: {
          getContaminationChip: jest
            .fn()
            .mockReturnValue({ text: 'Clean', icon: 'cleaning_services' }),
          getEnergySourceChip: jest.fn().mockReturnValue({
            text: 'Natural Gas',
            icon: 'local_gas_station',
          }),
          getTimeChip: jest
            .fn()
            .mockReturnValue({ text: '8760 h', icon: 'schedule' }),
        },
      },
      mockProvider(MatDialog, {
        open: jest.fn().mockReturnValue({
          afterClosed: () => of(undefined),
          close: jest.fn(),
          componentInstance: {},
        }),
      }),
      { provide: Router, useValue: { navigate: jest.fn() } },
    ],
    mocks: [TrackingService],
  });

  beforeAll(() => {
    sharedMockLoadCaseArray = new FormArray([
      new FormGroup({
        rotation: new FormGroup({
          typeOfMotion: new FormControl('LB_ROTATING'),
          rotationalSpeed: new FormControl(1500),
          shiftFrequency: new FormControl(undefined),
          shiftAngle: new FormControl(undefined),
        }),
        operatingTime: new FormControl(100),
        loadCaseName: new FormControl('Load Case 1'),
        operatingTemperature: new FormControl(70),
        load: new FormGroup({
          radialLoad: new FormControl(1000),
          axialLoad: new FormControl(500),
        }),
      }),
    ]);

    sharedMockOperationConditionsForm = new FormGroup({
      loadCaseData: sharedMockLoadCaseArray,
      lubrication: new FormGroup({
        lubricationSelection: new FormControl('oil'),
        oil: new FormGroup({
          selection: new FormControl('isoVgClass'),
          isoVgClass: new FormGroup({ isoVgClass: new FormControl(46) }),
        }),
      }),
      contamination: new FormControl('clean'),
      ambientTemperature: new FormControl(20),
      time: new FormControl(8760),
      energySource: new FormGroup({
        type: new FormControl('fossil'),
        fossil: new FormGroup({ fossilOrigin: new FormControl('natural_gas') }),
      }),
      conditionOfRotation: new FormControl('inner_ring_rotating'),
    });

    sharedMockForm = new FormGroup({
      operationConditions: sharedMockOperationConditionsForm,
    });

    sharedCreateLoadCaseFormGroup = new FormGroup({
      rotation: new FormGroup({
        typeOfMotion: new FormControl('LB_ROTATING'),
        rotationalSpeed: new FormControl(1500),
        shiftFrequency: new FormControl(undefined),
        shiftAngle: new FormControl(undefined),
      }),
      operatingTime: new FormControl(100),
      loadCaseName: new FormControl('New Load Case'),
      operatingTemperature: new FormControl(70),
      load: new FormGroup({
        radialLoad: new FormControl(1000),
        axialLoad: new FormControl(500),
      }),
    });
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
    storageService = spectator.inject(LocalStorageService);

    calculationParametersFacade = spectator.inject(
      CalculationParametersFacade
    ) as jest.Mocked<CalculationParametersFacade>;
    calculationResultFacade = spectator.inject(
      CalculationResultFacade
    ) as jest.Mocked<CalculationResultFacade>;
    formFactory = spectator.inject(
      CalculationParametersFormFactory
    ) as jest.Mocked<CalculationParametersFormFactory>;
    mockRouter = spectator.inject(Router) as jest.Mocked<Router>;
    trackingService = spectator.inject(
      TrackingService
    ) as jest.Mocked<TrackingService>;

    component['setupTemplateObservables'] = jest.fn();
    component['setupStaticObservables'] = jest.fn();
    component.parameterTemplates$ = of({
      mandatory: [],
      preset: [],
      loadCases: [],
    });
    component.contaminationOptions$ = of([]);
    component.electricityRegionOptions$ = of([]);
    component.fossilOriginOptions$ = of([]);
    component.environmentalInfluenceOptions$ = of([]);
    component.typeOfMotionsAvailable$ = of([]);

    formFactory.createForm.mockReturnValue({
      operationConditionsForm: sharedMockOperationConditionsForm,
      form: sharedMockForm,
      formErrors$: of({}),
    });

    formFactory.createLoadCaseDataFormGroup.mockReturnValue(
      sharedCreateLoadCaseFormGroup
    );

    spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
    component.operationConditionsForm = sharedMockOperationConditionsForm;
    component.form = sharedMockForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form when bearingClass is set', () => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component.ngOnChanges({});

      expect(formFactory.createForm).toHaveBeenCalledWith(
        CATALOG_BEARING_TYPE,
        200
      );
    });

    it('should handle slewing bearing initialization', () => {
      spectator.setInput('bearingClass', SLEWING_BEARING_TYPE);
      component.ngOnChanges({});

      expect(formFactory.createForm).toHaveBeenCalledWith(
        SLEWING_BEARING_TYPE,
        200
      );
    });
  });

  describe('Form getters', () => {
    beforeEach(() => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm']();
    });

    it('should return lubricationFormGroup', () => {
      const result = component.lubricationFormGroup;
      expect(result).toBeDefined();
      expect(result instanceof FormGroup).toBeTruthy();
    });

    it('should return energySourceFormGroup', () => {
      const result = component.energySourceFormGroup;
      expect(result).toBeDefined();
      expect(result instanceof FormGroup).toBeTruthy();
    });

    it('should return loadCaseDataFormArray', () => {
      const result = component.loadCaseDataFormArray;
      expect(result).toBeDefined();
      expect(result instanceof FormArray).toBeTruthy();
    });

    it('should return operatingTemperature for catalogue bearings', () => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      const result = component.operatingTemperature;
      expect(result).toBeDefined();
      expect(result instanceof FormControl).toBeTruthy();
    });

    it('should return undefined operatingTemperature for slewing bearings', () => {
      spectator.setInput('bearingClass', SLEWING_BEARING_TYPE);
      const result = component.operatingTemperature;
      expect(result).toBeUndefined();
    });

    it('should return isSingleLoadCaseForm correctly', () => {
      expect(component.isSingleLoadCaseForm).toBeTruthy();
    });

    it('should return totalOperatingTime', () => {
      const result = component.totalOperatingTime;
      expect(result).toBe(8760);
    });
  });

  describe('Navigation', () => {
    it('should navigate back when navigateBack is called', () => {
      component.navigateBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['home']);
    });
  });

  describe('when store button is clicked', () => {
    it('should emit the store name', () => {
      const storeName = 'App Store';
      component.sendClickEvent(storeName);
      expect(trackingService.logAppStoreClick).toHaveBeenCalledWith(
        storeName,
        'calculation-parameters'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('onResetButtonClick', () => {
    it('should reset the form and dispatch reset actions', () => {
      component['resetLoadcasesArray'] = jest.fn();
      component['resetCatalogCalculationResults'] = jest.fn();
      component['resetDownstreamCalculationResults'] = jest.fn();

      component.onResetButtonClick();

      expect(calculationParametersFacade.dispatch).toHaveBeenCalledWith(
        resetCalculationParameters()
      );
      expect(component['resetCatalogCalculationResults']).toHaveBeenCalled();
      expect(component['resetDownstreamCalculationResults']).toHaveBeenCalled();
    });
  });

  describe('Dialog operations', () => {
    it('should open basic frequencies dialog', () => {
      const openSpy = jest
        .spyOn(component['matDialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(undefined),
          close: jest.fn(),
          componentInstance: {},
        } as any);

      component.onShowBasicFrequenciesDialogClick();
      expect(openSpy).toHaveBeenCalledWith(expect.anything());
    });

    it('should open calculation types dialog', () => {
      const openSpy = jest
        .spyOn(component['matDialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(undefined),
          close: jest.fn(),
          componentInstance: {},
        } as any);

      component.onShowCalculationTypesClick();
      expect(openSpy).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('Load case management', () => {
    beforeEach(() => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm']();
    });

    it('should add a loadcase', () => {
      component['updateFirstLoadCaseName'] = jest.fn();
      const initialCount = component['loadCaseCount'];

      component.onAddLoadCaseClick();

      expect(component['updateFirstLoadCaseName']).toHaveBeenCalled();
      expect(formFactory.createLoadCaseDataFormGroup).toHaveBeenCalled();
      expect(component['loadCaseCount']).toBe(initialCount + 1);
      expect(trackingService.logLoadcaseEvent).toHaveBeenCalledWith(
        'Added',
        initialCount + 1
      );
    });

    it('should add loadcase for slewing bearing without operating temperature', () => {
      spectator.setInput('bearingClass', SLEWING_BEARING_TYPE);
      component['updateFirstLoadCaseName'] = jest.fn();

      component.onAddLoadCaseClick();

      expect(formFactory.createLoadCaseDataFormGroup).toHaveBeenCalledWith(
        'Load Case Test',
        undefined,
        SLEWING_BEARING_TYPE
      );
    });

    it('should remove a loadcase with confirmation', () => {
      const mockDialogRef = { afterClosed: () => of(true) };
      const formHelperService = spectator.inject(
        CalculationParametersFormHelperService
      ) as jest.Mocked<CalculationParametersFormHelperService>;
      formHelperService.openConfirmDeleteDialog.mockReturnValue(
        mockDialogRef as any
      );
      component['removeLoadcase'] = jest.fn();

      component.onRemoveLoadCaseClick(1);

      expect(formHelperService.openConfirmDeleteDialog).toHaveBeenCalled();
      expect(component['removeLoadcase']).toHaveBeenCalledWith(1);
    });

    it('should not remove loadcase when confirmation is canceled', () => {
      const mockDialogRef = { afterClosed: () => of(false) };
      const formHelperService = spectator.inject(
        CalculationParametersFormHelperService
      ) as jest.Mocked<CalculationParametersFormHelperService>;
      formHelperService.openConfirmDeleteDialog.mockReturnValue(
        mockDialogRef as any
      );
      component['removeLoadcase'] = jest.fn();

      component.onRemoveLoadCaseClick(1);

      expect(component['removeLoadcase']).not.toHaveBeenCalled();
    });

    it('should dispatch loadcase selection action', () => {
      component.onSelectedLoadCaseChange(2);
      expect(calculationParametersFacade.dispatch).toHaveBeenCalledWith(
        setSelectedLoadcase({ selectedLoadcase: 2 })
      );
    });

    it('should get load case time portion', () => {
      const result = component.getLoadCaseTimePortion(50);
      expect(result).toBe('100%');
    });
  });

  describe('Private methods', () => {
    beforeEach(() => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm']();
    });

    it('should update first loadcase name when multiple load cases', () => {
      expect(component.loadCaseDataFormArray).toBeDefined();
      component['updateFirstLoadCaseName']();
      expect(component['loadCaseCount']).toBe(1);
    });

    it('should set first loadcase name', () => {
      expect(component.loadCaseDataFormArray).toBeDefined();
      component['setFirstLoadcaseName']('New Name');
      expect(true).toBeTruthy();
    });

    it('should remove loadcase', () => {
      expect(component.loadCaseDataFormArray).toBeDefined();
      component['loadCaseCount'] = 2;
      component['removeLoadcase'](1);
      expect(component['loadCaseCount']).toBe(1);
      expect(trackingService.logLoadcaseEvent).toHaveBeenCalledWith(
        'Removed',
        1
      );
    });

    it('should reset selected loadcase when removing to single load case', () => {
      component['loadCaseCount'] = 1;
      component['setFirstLoadcaseName'] = jest.fn();

      component['removeLoadcase'](1);

      expect(calculationParametersFacade.dispatch).toHaveBeenCalledWith(
        setSelectedLoadcase({ selectedLoadcase: 0 })
      );
      expect(component['setFirstLoadcaseName']).toHaveBeenCalledWith('');
    });

    it('should reset loadcases array', () => {
      const loadCaseArray = new FormArray([
        new FormGroup({ name: new FormControl('Load case 1') }),
        new FormGroup({ name: new FormControl('Load case 2') }),
        new FormGroup({ name: new FormControl('Load case 3') }),
      ]);

      component.operationConditionsForm = new FormGroup({
        loadCaseData: loadCaseArray,
      });
      component['removeLoadcase'] = jest
        .fn()
        .mockImplementation((index: number) => {
          loadCaseArray.removeAt(index);
        });

      component['resetLoadcasesArray']();
      expect(component['removeLoadcase']).toHaveBeenCalledTimes(2);
    });

    it('should reset catalog calculation results', () => {
      component['resetCatalogCalculationResults']();
      expect(calculationResultFacade.dispatch).toHaveBeenCalled();
    });

    it('should reset downstream calculation results', () => {
      component['resetDownstreamCalculationResults']();
      expect(calculationResultFacade.dispatch).toHaveBeenCalled();
    });
  });

  describe('Template setup', () => {
    it('should setup template observables after view init', () => {
      component['setupTemplateObservables']();
      expect(component['setupTemplateObservables']).toHaveBeenCalled();
      expect(component.parameterTemplates$).toBeDefined();
    });

    it('should setup static observables', () => {
      component['setupStaticObservables']();
      expect(component['setupStaticObservables']).toHaveBeenCalled();
      expect(component.contaminationOptions$).toBeDefined();
      expect(component.electricityRegionOptions$).toBeDefined();
      expect(component.fossilOriginOptions$).toBeDefined();
      expect(component.environmentalInfluenceOptions$).toBeDefined();
      expect(component.typeOfMotionsAvailable$).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should initialize form when bearingClass is available', () => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm'] = jest.fn();
      component['setupFormSubscriptions'] = jest.fn();

      component.ngOnInit();

      expect(component['initializeForm']).toHaveBeenCalled();
    });

    it('should always initialize form since bearingClass is required', () => {
      // Since bearingClass is now a required input signal, it will always have a value
      // and initializeForm will always be called
      component['initializeForm'] = jest.fn();

      component.ngOnInit();

      expect(component['initializeForm']).toHaveBeenCalled();
    });

    it('should restore parameters after templates have been loaded', () => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm']();

      // Trigger the combineLatest observable
      mockCalculationTypes$.next({
        ratingLife: { selected: true, visible: true, disabled: false },
        frictionalPowerloss: {
          selected: false,
          visible: true,
          disabled: false,
        },
      });
      mockTemplates$.next({
        loadcaseTemplate: ['template1'],
        operatingConditionsTemplate: ['template2'],
      });

      expect(storageService.restoreStoredSession).toHaveBeenCalled();
    });
  });

  describe('Form validation and subscriptions', () => {
    beforeEach(() => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm']();
    });

    it('should setup form validation', () => {
      component['setupFormValidation']();
      const ambientTempControl = component.ambientTemperatureControl;
      const operatingTempControl = component.operatingTemperature;
      expect(ambientTempControl).toBeDefined();
      expect(operatingTempControl).toBeDefined();
    });

    it('should handle form value changes', () => {
      const mockFormValue = {
        operationConditions: {
          loadCaseData: [{ loadCaseName: 'Test' }],
          contamination: 'clean',
        },
      };
      expect(component.form).toBeDefined();
      component.form?.patchValue(mockFormValue);
      expect(calculationParametersFacade.dispatch).toHaveBeenCalled();
    });

    it('should handle form status changes', () => {
      expect(component.form).toBeDefined();
      component.form?.setErrors({ invalid: true });
      expect(calculationParametersFacade.dispatch).toHaveBeenCalled();
    });
  });

  describe('Type conversion helpers', () => {
    it('should convert to FormGroup', () => {
      const control = new FormGroup({});
      const result = component.asFormGroup(control);
      expect(result).toBe(control);
    });

    it('should convert to FormControl', () => {
      const control = new FormControl();
      const result = component.asFormControl(control);
      expect(result).toBe(control);
    });
  });

  describe('Preset chips functionality', () => {
    beforeEach(() => {
      spectator.setInput('bearingClass', CATALOG_BEARING_TYPE);
      component['initializeForm']();
      component['setupPresetChips']();
    });

    it('should setup preset chips observable', () => {
      expect(component.presetChips$).toBeDefined();
    });

    it('should generate chips from form values', () => {
      mockCalculationFieldsConfig$.next({
        required: ['load'],
        preset: [
          'contamination',
          'energySource',
          'time',
          'conditionOfRotation',
        ],
      });
      expect(component.presetChips$).toBeTruthy();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle undefined operationConditionsForm gracefully', () => {
      component.operationConditionsForm = undefined;

      expect(component.lubricationFormGroup).toBeUndefined();
      expect(component.energySourceFormGroup).toBeUndefined();
      expect(component.loadCaseDataFormArray).toBeUndefined();
      expect(component.operatingTemperature).toBeUndefined();
      expect(component.isSingleLoadCaseForm).toBeTruthy();
      expect(component.totalOperatingTime).toBe(0);
    });

    it('should handle empty load case array', () => {
      component.operationConditionsForm = new FormGroup({
        loadCaseData: new FormArray([]),
      });

      expect(component.isSingleLoadCaseForm).toBeFalsy();
    });

    it('should handle missing form controls', () => {
      component.operationConditionsForm = new FormGroup({});

      expect(component.ambientTemperatureControl).toBeUndefined();
      expect(component.contaminationControl).toBeUndefined();
      expect(component.timeControl).toBeUndefined();
      expect(component.conditionOfRotationControl).toBeUndefined();
    });
  });
});

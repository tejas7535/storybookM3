/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import {
  ClassProvider,
  effect,
  ExistingProvider,
  FactoryProvider,
  InjectionToken,
  Injector,
  Provider,
  ProviderToken,
  SchemaMetadata,
  signal,
  StaticProvider,
  Type,
  ValueProvider,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-enterprise';
import { MockProvider, MockService } from 'ng-mocks';

import { AppRoutePath } from '../../app.routes.enum';
import { AlertRulesService } from '../../feature/alert-rules/alert-rules.service';
import { AlertService } from '../../feature/alerts/alert.service';
import { Alert } from '../../feature/alerts/model';
import { CMPService } from '../../feature/customer-material-portfolio/cmp.service';
import { DemandValidationService } from '../../feature/demand-validation/demand-validation.service';
import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import { CurrencyService } from '../../feature/info/currency.service';
import { IMRService } from '../../feature/internal-material-replacement/imr.service';
import { MaterialCustomerService } from '../../feature/material-customer/material-customer.service';
import { PlanningLevelService } from '../../feature/sales-planning/planning-level.service';
import { SalesPlanningService } from '../../feature/sales-planning/sales-planning.service';
import { AlertRulesColumnSettingsService } from '../../pages/alert-rules/table/services/alert-rules-column-settings.service';
import { ExportMaterialCustomerService } from '../../pages/home/table/services/export-material-customer.service';
import { MaterialCustomerTableService } from '../../pages/home/table/services/material-customer-table.service';
import { MonthlyCustomerPlanningDetailsColumnSettingsService } from '../../pages/sales-planning/components/customer-planning-details/monthly-customer-planning-details-modal/service/monthly-customer-planning-details-column-settings.service';
import { YearlyCustomerPlanningDetailsColumnSettingsService } from '../../pages/sales-planning/components/customer-planning-details/service/customer-planning-details-column-settings.service';
import { GlobalSelectionStateService } from '../components/global-selection-criteria/global-selection-state.service';
import { NumberWithoutFractionDigitsPipe } from '../pipes/number-without-fraction-digits.pipe';
import { AgGridLocalizationService } from '../services/ag-grid-localization.service';
import { SelectableOptionsService } from '../services/selectable-options.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../utils/auth/auth.service';
import { SnackbarService } from '../utils/service/snackbar.service';
import { StreamSaverService } from '../utils/service/stream-saver.service';
import { ValidationHelper } from '../utils/validation/validation-helper';

// Angular's effect function depends on a lot of deeper Angular stuff. We want to enable unit testing at the component level, so we need to be able to inject a standalone effect function
export const EFFECT_FACTORY_TOKEN = new InjectionToken('effect');
export type EffectFactory = typeof effect;

export function provideEffect(): Provider {
  return { provide: EFFECT_FACTORY_TOKEN, useValue: effect };
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Stub {
  private static readonly defaultMockedProviders: (
    | ValueProvider
    | FactoryProvider
    | ClassProvider
    | ExistingProvider
  )[] = [
    MockProvider(
      TranslocoService,
      {
        langChanges$: of('en'),
        config: {
          defaultLang: 'en',
          reRenderOnLangChange: false,
          prodMode: false,
          failedRetries: 1,
        },
        setTranslation: () => {},
        getActiveLang: () => 'en',
        translate: (key: string) => key,
      },
      'useValue'
    ),
    MockProvider(
      TranslocoLocaleService,
      {
        localeChanges$: of('en-US'),
        getLocale: () => 'en-US',
        localizeDate: () => '',
        localizeNumber: () => '',
      },
      'useValue'
    ),
    MockProvider(
      MatDialogRef,
      { afterClosed: () => of({ reloadData: true }), close: () => {} },
      'useValue'
    ),
    MockProvider(IMRService, this.getIMRService(), 'useValue'),
    MockProvider(SnackbarService, { openSnackBar: jest.fn() }),
    MockProvider(
      SelectableOptionsService,
      {
        loading$: new BehaviorSubject<boolean>(false),
        get: () =>
          ({
            options: [],
            loading: false,
            loadingError: null,
          }) as any,
        getOptionsBySearchTerm: jest.fn().mockReturnValue(of([])),
      },
      'useValue'
    ),
    MockProvider(
      GlobalSelectionHelperService,
      {
        getResultCount: () => of(0),
        getCustomersData: () => of([]),
      },
      'useValue'
    ),
    MockProvider(
      GlobalSelectionStateService,
      {
        form: jest.fn().mockReturnValue(new FormGroup({})),
        getState: jest.fn().mockReturnValue({}),
        getGlobalSelectionStatus: jest.fn().mockReturnValue(''),
        navigateWithGlobalSelection: jest.fn().mockReturnValue(of(true)),
      },
      'useValue'
    ),
    MockProvider(CurrencyService, this.getCurrencyService(), 'useValue'),
    MockProvider(
      AgGridLocalizationService,
      {
        lang: jest.fn(),
        dateFormatter: jest.fn().mockReturnValue('formattedDate'),
        numberFormatter: jest.fn().mockReturnValue('formattedNumber'),
      },
      'useValue'
    ),
    MockProvider(HttpClient, this.getHttpClient(), 'useValue'),
  ];

  private static fixture: ComponentFixture<any> | null = null;

  public static get<T>({
    component,
    providers,
  }: {
    component: ProviderToken<T>;
    providers?: (Provider | StaticProvider)[];
  }): T {
    this.fixture = null;
    this.initValidationHelper();

    return Injector.create({
      providers: [
        this.defaultMockedProviders,
        ...(providers ?? []),
        { provide: component },
      ] as (Provider | StaticProvider)[],
    }).get(component);
  }

  public static getForEffect<T>({
    component,
    providers,
    declarations,
    imports,
    schemas,
  }: {
    component: Type<T>;
    providers?: (Provider | StaticProvider)[];
    declarations?: (Provider | StaticProvider)[];
    imports?: any[];
    schemas?: (SchemaMetadata | any[])[];
  }): T {
    this.fixture = null;

    TestBed.configureTestingModule({
      declarations: [...(declarations ?? [])],
      imports: [component, ...(imports ?? [])],
      providers: [this.defaultMockedProviders, ...(providers ?? [])],
      schemas,
    }).compileComponents();

    this.initValidationHelper();
    this.fixture = TestBed.createComponent<T>(component);

    return this.fixture.debugElement.componentInstance;
  }

  public static setInputs(inputs: { property: string; value: any }[]): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    Object.values(inputs).forEach(({ property, value }) =>
      this.setInput(property, value)
    );
  }

  public static setInput(property: string, value: any): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    this.fixture.componentRef.setInput(property, value);
  }

  public static detectChanges(): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    this.fixture.detectChanges();
  }

  public static getFixture<T = any>(): ComponentFixture<T> {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    return this.fixture;
  }

  public static initValidationHelper(): void {
    ValidationHelper.localeService = MockService(TranslocoLocaleService, {
      getLocale: () => 'en-US',
      localizeDate: () => '',
      localizeNumber: () => '',
    });
  }

  public static getGridApi(): GridApi {
    return {
      setGridOption: jest.fn(),
      showNoRowsOverlay: jest.fn(),
      hideOverlay: jest.fn(),
      autoSizeAllColumns: jest.fn(),
      expandAll: jest.fn(),
      collapseAll: jest.fn(),
      refreshServerSide: jest.fn(),
      applyTransaction: jest.fn(),
      setColumnDefs: jest.fn(),
      applyServerSideTransaction: jest.fn(),
      getDisplayedRowCount: jest.fn(),
    } as any;
  }

  public static getHttpClient(data?: {
    get?: any;
    post?: any;
    patch?: any;
    request?: any;
    delete?: any;
    put?: any;
  }): HttpClient {
    return {
      get: () => of(data?.get ?? {}),
      post: () => of(data?.post ?? {}),
      patch: () => of(data?.patch ?? {}),
      request: () => of(data?.request ?? {}),
      delete: () => of(data?.delete ?? {}),
      put: () => of(data?.put ?? {}),
    } as any;
  }

  public static getIMRService(): IMRService {
    return {
      saveSingleIMRSubstitution: jest.fn(),
      saveMultiIMRSubstitution: jest.fn().mockReturnValue(of({} as any)),
      createInternalMaterialReplacementDatasource: jest
        .fn()
        .mockReturnValue(() => {}),
      getDataFetchedEvent: jest.fn().mockReturnValue(of({ rowCount: 10 })),
    } as any;
  }

  public static getCurrencyService(): CurrencyService {
    return {
      getCurrentCurrency: () => of('EUR'),
      getAvailableCurrencies: () => of([]),
      setCurrentCurrency: jest.fn(),
    } as any;
  }

  public static getAlertRulesServiceProvider(): ValueProvider {
    return MockProvider(
      AlertRulesService,
      {
        getAlertRuleData: jest.fn().mockReturnValue(of({})),
        getRuleTypeData: jest.fn().mockReturnValue(of({})),
        saveMultiAlertRules: jest.fn().mockReturnValue(
          of({
            overallStatus: '',
            response: [],
          } as any)
        ),
        deleteMultiAlterRules: jest.fn().mockReturnValue(
          of({
            overallStatus: '',
            response: [],
          } as any)
        ),
        deleteSingleAlterRule: jest.fn().mockReturnValue(
          of({
            overallStatus: '',
            response: [],
          } as any)
        ),
      },
      'useValue'
    );
  }

  public static getMatDialogProvider(): ValueProvider {
    return MockProvider(
      MatDialog,
      {
        closeAll: jest.fn(),
        open: jest.fn().mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(of({ reloadData: true })),
        }),
      },
      'useValue'
    );
  }

  public static getMatDialogDataProvider(data: any): ValueProvider {
    return MockProvider(MAT_DIALOG_DATA, data, 'useValue');
  }

  public static getAlertRulesColumnSettingsServiceProvider(): ValueProvider {
    return MockProvider(
      AlertRulesColumnSettingsService,
      {
        getColumnSettings: jest.fn().mockReturnValue(of([])),
        applyStoredFilters: jest.fn(),
      },
      'useValue'
    );
  }

  public static getStoreProvider(returnValue?: any): ValueProvider {
    return MockProvider(
      Store,
      { select: jest.fn().mockReturnValue(of(returnValue ?? [])) },
      'useValue'
    );
  }

  public static getCMPServiceProvider(): ValueProvider {
    return MockProvider(
      CMPService,
      {
        saveBulkPhaseIn: jest.fn(),
        getDataFetchedEvent: jest.fn(),
        getCMPCriteriaData: jest.fn().mockReturnValue(
          of({
            filterableFields: [],
            sortableFields: [],
          })
        ),
        createCustomerMaterialPortfolioDatasource: jest.fn(),
      },
      'useValue'
    );
  }

  public static getDemandValidationServiceProvider(): ValueProvider {
    return MockProvider(
      DemandValidationService,
      {
        saveValidatedDemandSingleMcc: jest.fn().mockReturnValue(of('')),
        getKpiBuckets: jest.fn().mockReturnValue(of([])),
        saveValidatedDemandBatch: jest.fn(),
        getKpiData: jest.fn().mockReturnValue(of({})),
      },
      'useValue'
    );
  }

  public static getMaterialCustomerServiceProvider(): ValueProvider {
    return MockProvider(
      MaterialCustomerService,
      {
        getCriteriaData: jest.fn().mockReturnValue(
          of({
            filterableFields: [],
            sortableFields: [],
          })
        ),
      },
      'useValue'
    );
  }

  public static getMaterialCustomerTableServiceProvider(): ValueProvider {
    return MockProvider(
      MaterialCustomerTableService,
      {
        useMaterialCustomerColumnLayouts: jest.fn(),
        createMaterialCustomerDatasource: jest.fn(),
      },
      'useValue'
    );
  }

  public static getPlanningLevelServiceProvider(): ValueProvider {
    return MockProvider(
      PlanningLevelService,
      {
        getMaterialTypeByCustomerNumber: jest.fn().mockReturnValue(
          of({
            planningLevelMaterialType: 'GP',
            isDefaultPlanningLevelMaterialType: true,
          })
        ),
        deleteMaterialTypeByCustomerNumber: jest.fn(() => of(null)),
      },
      'useValue'
    );
  }

  public static getSalesPlanningServiceProvider(data?: {
    getDetailedCustomerSalesPlan?: any;
    getCustomerSalesPlan?: any;
    getCustomerInfo?: any;
  }): ValueProvider {
    return MockProvider(
      SalesPlanningService,
      {
        getDetailedCustomerSalesPlan: () =>
          of(data?.getDetailedCustomerSalesPlan ?? []),
        getCustomerSalesPlan: () => of(data?.getCustomerSalesPlan ?? {}),
        getCustomerInfo: () => of(data?.getCustomerInfo ?? []),
        deleteDetailedCustomerSalesPlan: () => of(),
        updateDetailedCustomerSalesPlan: () => of(),
        deleteShares: () => of(),
        updateShares: () => of(),
      },
      'useValue'
    );
  }

  public static getYearlyCustomerPlanningDetailsColumnSettingsServiceProvider(): ValueProvider {
    return MockProvider(
      YearlyCustomerPlanningDetailsColumnSettingsService,
      { getColumnSettings: jest.fn(() => of([])) },
      'useValue'
    );
  }

  public static getExportMaterialCustomerServiceProvider(): ValueProvider {
    return MockProvider(
      ExportMaterialCustomerService,
      { triggerExport: jest.fn().mockReturnValue(of(null)) },
      'useValue'
    );
  }

  public static getMonthlyCustomerPlanningDetailsColumnSettingsServiceProvider(): ValueProvider {
    return MockProvider(
      MonthlyCustomerPlanningDetailsColumnSettingsService,
      {
        getColumnSettings: jest.fn(),
        saveColumnSettings$: jest.fn(),
        loadColumnSettings$: jest.fn(),
        saveFromAgGridEvent: jest.fn(),
        applyStoredFilters: jest.fn(),
      },
      'useValue'
    );
  }

  public static getNumberWithoutFractionDigitsPipeProvider(): ValueProvider {
    return MockProvider(
      NumberWithoutFractionDigitsPipe,
      { transform: jest.fn() },
      'useValue'
    );
  }

  public static getRouterProvider(): ValueProvider {
    return MockProvider(
      Router,
      {
        events: new BehaviorSubject([]),
        parseUrl: jest.fn(),
        navigate: jest.fn(),
      },
      'useValue'
    );
  }

  public static getActivatedRouteProvider(): FactoryProvider {
    return MockProvider(ActivatedRoute);
  }

  public static getAuthServiceProvider(getUserRoles?: any): ValueProvider {
    return MockProvider(
      AuthService,
      {
        getUserRoles: () => getUserRoles ?? of([]),
        hasUserAccess: () => of(true),
      },
      'useValue'
    );
  }

  public static getAlertServiceProvider(): ValueProvider {
    return MockProvider(
      AlertService,
      {
        init: () => {},
        allActiveAlerts: signal<Alert[]>(null),
        getRefreshEvent: () => of(true),
        getDataFetchedEvent: () => of(true),
        refreshHashTimer: () => {},
        completeAlert: (id: string) => of(id),
        activateAlert: (id: string) => of(id),
        deactivateAlert: (id: string) => of(id),
        loadActiveAlerts: () => {},
        createAlertDatasource: () => ({ getRows: {} }),
        getRouteForOpenFunction: () => '',
        getModuleForOpenFunction: () => '',
      },
      'useValue'
    );
  }

  public static getUserServiceProvider(data?: {
    filterVisibleRoutes?: any;
    startPage?: any;
    userSettings?: any;
    region?: any;
    getStartPage?: any;
    updateUserSettings?: any;
    loadRegion?: any;
  }): ValueProvider {
    return MockProvider(
      UserService,
      {
        init: () => {},
        settingsLoaded$: new BehaviorSubject<boolean>(false),
        userSettings: signal(
          data?.userSettings ?? {
            startPage: null,
            demandValidation: null,
          }
        ),
        region: data?.region ?? signal(''),
        startPage: data?.startPage ?? signal(AppRoutePath.OverviewPage),
        filterVisibleRoutes: jest
          .fn()
          .mockReturnValue(data?.filterVisibleRoutes ?? []),
        getStartPage: jest.fn().mockReturnValue(of(data?.getStartPage ?? null)),
        updateUserSettings: jest
          .fn()
          .mockReturnValue(of(data?.updateUserSettings ?? null)),
        updateDemandValidationUserSettings: jest.fn(() => {}),
        loadRegion: jest.fn(() => of(data?.loadRegion ?? '')),
      },
      'useValue'
    );
  }

  public static getMsalServiceProvider(): ValueProvider {
    return MockProvider(
      MsalService,
      {
        handleRedirectObservable: () => of(true),
        instance: {
          enableAccountStorageEvents: () => {},
          setActiveAccount: () => {},
          getAllAccounts: (): any => [],
          getActiveAccount: (): any => null,
        },
      },
      'useValue'
    );
  }

  public static getMsalBroadcastServiceProvider(
    msalSubject$: BehaviorSubject<any> = new BehaviorSubject(null),
    inProgress$: BehaviorSubject<any> = new BehaviorSubject(null)
  ): ValueProvider {
    return MockProvider(
      MsalBroadcastService,
      { msalSubject$, inProgress$ },
      'useValue'
    );
  }

  public static getStreamSaverServiceProvider(): ValueProvider {
    return MockProvider(
      StreamSaverService,
      {
        init: () => {},
        initializeStreamSaver: () => Promise.resolve(),
        streamResponseToFile: () => Promise.resolve(),
      },
      'useValue'
    );
  }

  public static getDateAdapterProvider(): ValueProvider {
    return MockProvider(DateAdapter, { setLocale: () => {} }, 'useValue');
  }
}

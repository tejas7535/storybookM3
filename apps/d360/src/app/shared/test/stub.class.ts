/* eslint-disable max-lines */
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import {
  ClassProvider,
  effect,
  ElementRef,
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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, of, Subject } from 'rxjs';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-enterprise';
import { MockProvider, MockService } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '../../app.routes.enum';
import { AlertRulesService } from '../../feature/alert-rules/alert-rules.service';
import { AlertService, GroupedAlert } from '../../feature/alerts/alert.service';
import { Alert } from '../../feature/alerts/model';
import { CMPService } from '../../feature/customer-material-portfolio/cmp.service';
import { DemandValidationService } from '../../feature/demand-validation/demand-validation.service';
import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import { CurrencyService } from '../../feature/info/currency.service';
import { IMRService } from '../../feature/internal-material-replacement/imr.service';
import { MaterialCustomerService } from '../../feature/material-customer/material-customer.service';
import { OverviewService } from '../../feature/overview/overview.service';
import { PlanningLevelService } from '../../feature/sales-planning/planning-level.service';
import { SalesPlanningService } from '../../feature/sales-planning/sales-planning.service';
import { ExportMaterialCustomerService } from '../../pages/home/table/services/export-material-customer.service';
import { MaterialCustomerTableService } from '../../pages/home/table/services/material-customer-table.service';
import { GlobalSelectionStateService } from '../components/global-selection-criteria/global-selection-state.service';
import { TableService } from '../components/table';
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
        localeChanges$: new BehaviorSubject('en-US'),
        getLocale: () => 'en-US',
        localizeDate: () => '',
        localizeNumber: () => '',
      },
      'useValue'
    ),
    MockProvider(
      MatDialogRef,
      {
        afterClosed: () => of({ reloadData: true }),
        close: () => {},
      },
      'useValue'
    ),
    MockProvider(IMRService, this.getIMRService(), 'useValue'),
    MockProvider(SnackbarService, {
      show: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    }),
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
        getFilterColDef: jest.fn().mockReturnValue(of({})),
      },
      'useValue'
    ),
    MockProvider(
      GlobalSelectionHelperService,
      {
        getResultCount: () => of(0),
        getCustomersData: () => of([]),
        resolveAlertTypes: jest.fn(),
        resolveCustomerNumbers: jest.fn(),
        resolveGkamNumber: jest.fn(),
        resolveFor2Characters: jest.fn(),
        resolveMaterialNumbers: jest.fn(),
        resolveProductionPlants: jest.fn(),
        resolveProductionSegment: jest.fn(),
        resolveForText: jest.fn(),
        resolveSalesOrg: jest.fn(),
        resolveSectors: jest.fn(),
      },
      'useValue'
    ),
    MockProvider(
      GlobalSelectionStateService,
      {
        form: signal(
          new FormGroup({
            region: new FormControl([]),
            salesArea: new FormControl([]),
            sectorManagement: new FormControl([]),
            salesOrg: new FormControl([]),
            gkamNumber: new FormControl([]),
            customerNumber: new FormControl([]),
            materialClassification: new FormControl([]),
            sector: new FormControl([]),
            materialNumber: new FormControl([]),
            productionPlant: new FormControl([]),
            productionSegment: new FormControl([]),
            alertType: new FormControl([]),
          })
        ),
        getState: jest.fn().mockReturnValue({}),
        getGlobalSelectionStatus: jest.fn().mockReturnValue(''),
        navigateWithGlobalSelection: jest.fn().mockReturnValue(of(true)),
        handleQueryParams$: jest.fn().mockReturnValue(of(true)),
        isEmpty: jest.fn().mockReturnValue(true),
        resetState: jest.fn(),
        saveState: jest.fn(),
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
    MockProvider(FormBuilder),
    MockProvider(ApplicationInsightsService, {
      logEvent: jest.fn(),
    }),
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
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getForEffect()?'
      );
    }

    Object.values(inputs).forEach(({ property, value }) =>
      this.setInput(property, value)
    );
  }

  public static setInput(property: string, value: any): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getForEffect()?'
      );
    }

    this.fixture.componentRef.setInput(property, value);
  }

  public static detectChanges(): void {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getForEffect()?'
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

  public static inject<T = any>(element: ProviderToken<T>): T {
    if (!this.fixture) {
      throw new Error(
        '[Stub] No fixture available, did you used stub.get() instead of Stub.getWithEffect()?'
      );
    }

    return TestBed.inject(element);
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
      addEventListener: jest.fn(),
      applyColumnState: jest.fn(),
      applyServerSideTransaction: jest.fn(),
      applyTransaction: jest.fn(),
      autoSizeAllColumns: jest.fn(),
      collapseAll: jest.fn(),
      deselectAll: jest.fn(),
      expandAll: jest.fn(),
      forEachNode: jest.fn(),
      getColumnDefs: jest.fn(),
      getColumns: jest.fn(),
      getColumnState: jest.fn(),
      getDisplayedRowAtIndex: jest.fn(),
      getDisplayedRowCount: jest.fn(),
      getFilterModel: jest.fn(),
      getFocusedCell: jest.fn(),
      getRowNode: jest.fn(),
      getSelectedRows: jest.fn(),
      hideOverlay: jest.fn(),
      isDestroyed: jest.fn(),
      onFilterChanged: jest.fn(),
      redrawRows: jest.fn(),
      refreshHeader: jest.fn(),
      refreshServerSide: jest.fn(),
      setColumnDefs: jest.fn(),
      setFilterModel: jest.fn(),
      setGridOption: jest.fn(),
      showNoRowsOverlay: jest.fn(),
      sizeColumnsToFit: jest.fn(),
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
      deleteIMRSubstitution: jest.fn(),
      saveSingleIMRSubstitution: jest.fn(),
      saveMultiIMRSubstitution: jest.fn().mockReturnValue(of({} as any)),
      getDataFetchedEvent: jest.fn().mockReturnValue(of({ rowCount: 10 })),
      getIMRData: jest.fn().mockReturnValue(of([])),
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

  public static getStoreProvider(returnValue?: any): ValueProvider {
    return MockProvider(
      Store,
      {
        select: jest.fn().mockReturnValue(of(returnValue ?? [])),
        pipe: jest.fn(),
      },
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
        getCMPData: jest.fn().mockReturnValue(of([])),
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
        getMaterialCustomerData: jest.fn(),
        deleteValidatedDemandBatch: jest.fn(),
        getKpiData: jest.fn().mockReturnValue(of({})),
        triggerExport: jest.fn().mockReturnValue(of({})),
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
        getMaterialCustomerData: jest
          .fn()
          .mockReturnValue(of({ rows: [], rowCount: 0 })),
      },
      'useValue'
    );
  }

  public static getMaterialCustomerTableServiceProvider(): ValueProvider {
    return MockProvider(
      MaterialCustomerTableService,
      { getMaterialCustomerData: jest.fn() },
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
        updateOtherRevenues: () => of(),
        getComments$: () => of([]),
        postComment$: () => of(),
      },
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

  public static getNumberWithoutFractionDigitsPipeProvider(): ValueProvider {
    return MockProvider(
      NumberWithoutFractionDigitsPipe,
      { transform: jest.fn() },
      'useValue'
    );
  }

  public static getRouterProvider(
    events: BehaviorSubject<any> = new BehaviorSubject(null)
  ): ValueProvider {
    return MockProvider(
      Router,
      {
        events,
        getCurrentNavigation: jest.fn(),
        navigate: jest.fn(),
        parseUrl: jest.fn(),
      },
      'useValue'
    );
  }

  public static getActivatedRouteProvider(
    queryParams: BehaviorSubject<any> = new BehaviorSubject(null)
  ): FactoryProvider {
    return MockProvider(ActivatedRoute, { queryParams });
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
        refreshEvent: new Subject<void>(),
        allActiveAlerts: signal<Alert[]>(null),
        getRefreshEvent: () => of(true),
        getDataFetchedEvent: () => of(true),
        refreshHashTimer: () => {},
        completeAlert: (id: string) => of(id),
        activateAlert: (id: string) => of(id),
        deactivateAlert: (id: string) => of(id),
        loadActiveAlerts: () => {},
        createAlertDatasource: () => ({ getRows: {} }),
        getRouteForOpenFunction: () => AppRoutePath.DemandValidationPage,
        getModuleForOpenFunction: () => '',
        getLoadingEvent: () => of(false),
        getFetchErrorEvent: () => of(false),
        groupDataByCustomerAndPriority: (): GroupedAlert[] => [],
        getAlertData: () => of({}),
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
            overviewPage: {
              onlyAssignedToMe: false,
            },
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

  public static getBreakpointObserverProvider(): ValueProvider {
    return MockProvider(
      BreakpointObserver,
      { observe: () => of() },
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
    return MockProvider(
      DateAdapter,
      {
        setLocale: () => {},
      },
      'useValue'
    );
  }

  public static getOverviewProvider(): ValueProvider {
    return MockProvider(
      OverviewService,
      { getRelevantPlanningKPIs: () => of() },
      'useValue'
    );
  }

  public static getTableServiceProvider(): ValueProvider {
    return MockProvider(
      TableService,
      {
        tableId: 'testTable',
        columnDefinitions: [],
        gridApi: Stub.getGridApi(),
        addId: 999_999,
        tableSettings$: new BehaviorSubject<any[]>([]),
        init: () => {},
        setTableSettings$: () => of(true),
      },
      'useValue'
    );
  }

  public static getTranslocoLocaleServiceProvider(): ValueProvider {
    return MockProvider(
      TranslocoLocaleService,
      { getLocale: jest.fn() },
      'useValue'
    );
  }

  public static getElementRefProvider(): ValueProvider {
    return MockProvider(
      ElementRef,
      { nativeElement: document.createElement('div') },
      'useValue'
    );
  }
}

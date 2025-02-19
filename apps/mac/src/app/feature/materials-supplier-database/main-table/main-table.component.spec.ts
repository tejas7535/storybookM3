import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import {
  MsdAgGridConfigService,
  MsdAgGridStateService,
  MsdDataService,
  MsdDialogService,
} from '@mac/msd/services';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import { initialState as initialQuickfilterState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import { DataFacade } from '../store/facades/data';
import { DialogFacade } from '../store/facades/dialog';
import { QuickFilterFacade } from '../store/facades/quickfilter';
import { MsdNavigationComponent } from './components/msd-navigation/msd-navigation.component';
import { MainTableComponent } from './main-table.component';
import { STEEL_STATIC_QUICKFILTERS } from './quick-filter/config/steel';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { QuickFilterManagementComponent } from './quick-filter/quick-filter-management/quick-filter-management.component';
import { STEEL_COLUMN_DEFINITIONS } from './table-config/materials/steel';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

// Mock cell renderers.
// Otherwise following error is thrown: "Class extends value undefined is not a constructor or null"
jest.mock('./cell-renderers/link-cell-renderer/link-cell-renderer.component');
jest.mock(
  './cell-renderers/green-steel-cell-renderer/green-steel-cell-renderer.component'
);
jest.mock(
  './cell-renderers/action-cell-renderer/action-cell-renderer.component'
);

@Injectable()
class MockDataFacade extends DataFacade {
  fetchClassOptions = jest.fn();
  setAgGridFilter = jest.fn();
}

describe('MainTableComponent', () => {
  let component: MainTableComponent;
  let spectator: Spectator<MainTableComponent>;
  let dataFacade: DataFacade;
  let route: ActivatedRoute;
  let router: Router;

  const initialState = {
    msd: {
      data: initialDataState,
      dialog: initialDialogState,
      quickfilter: initialQuickfilterState,
    },
    'azure-auth': {
      accountInfo: {
        idTokenClaims: {
          roles: ['material-supplier-database-test-editor'],
        },
        department: 'mock_department',
        homeAccountId: 'mock_id',
        environment: 'mock_environment',
        tenantId: 'mock_id',
        username: 'mock_name',
        localAccountId: 'mock_id',
        name: 'mock_name',
      },
      profileImage: {
        url: 'mock_url',
        loading: false,
        errorMessage: 'mock_message',
      },
    },
  };

  const createComponent = createComponentFactory({
    component: MainTableComponent,
    imports: [
      MockComponent(MsdNavigationComponent),
      MockComponent(QuickFilterComponent),
      MockComponent(QuickFilterManagementComponent),
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openDisclaimerDialog: jest.fn(),
        },
      },
      MockProvider(MsdDataService),
      {
        provide: MsdAgGridStateService,
        useValue: {
          getLastActiveNavigationLevel: jest.fn(() => ({
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
          })),
          getDisclaimerConsentTimeout: jest.fn(() => Number.MAX_VALUE),
        },
      },
      {
        provide: MsdAgGridConfigService,
        useValue: {
          getStaticQuickFilters: jest.fn(() => STEEL_STATIC_QUICKFILTERS),
          columnDefinitions$: new BehaviorSubject({
            defaultColumnDefinitions: STEEL_COLUMN_DEFINITIONS,
            savedColumnState: undefined,
          }),
        },
      },
      {
        provide: DialogFacade,
        useValue: {
          dispatch: jest.fn(),
          sapMaterialsDatabaseUploadStatus$: of(),
        },
      },
      MockProvider(DataFacade, MockDataFacade, 'useClass'),
      mockProvider(QuickFilterFacade),
      DatePipe,
      provideRouter([]),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dataFacade = spectator.inject(DataFacade);
    route = spectator.inject(ActivatedRoute);
    router = spectator.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should NOT open disclaimer consent dialog on startup', () => {
      expect(
        component['dialogService'].openDisclaimerDialog
      ).not.toHaveBeenCalled();
    });
    it('should open disclaimer consent dialog on startup', () => {
      component['stateService'].getDisclaimerConsentTimeout = jest.fn(() => 0);
      component.ngOnInit();
      expect(
        component['dialogService'].openDisclaimerDialog
      ).toHaveBeenCalled();
    });
  });
  describe('parseQueryParams', () => {
    it('should do nothing if no filters are set in query params', () => {
      component['changeDetectorRef'].markForCheck = jest.fn();
      component['changeDetectorRef'].detectChanges = jest.fn();
      component['setParamAgGridFilter'] = jest.fn();
      router.navigate = jest.fn();

      route.snapshot.queryParamMap.get = jest.fn();

      component['parseQueryParams']();

      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'materialClass'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'navigationLevel'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'agGridFilter'
      );
      expect(component['setParamAgGridFilter']).not.toHaveBeenCalled();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
      });
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });

    it('should call the set filter functions if filters are defined in query params', () => {
      component['changeDetectorRef'].markForCheck = jest.fn();
      component['changeDetectorRef'].detectChanges = jest.fn();
      component['setParamAgGridFilter'] = jest.fn();
      router.navigate = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      route.snapshot.queryParamMap.get = jest.fn((str) => {
        switch (str) {
          case 'materialClass': {
            return 'st';
          }
          case 'navigationLevel': {
            return 'materials';
          }
          default: {
            return 'some params';
          }
        }
      });

      component['parseQueryParams']();

      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'materialClass'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'navigationLevel'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'agGridFilter'
      );
      expect(component['setParamAgGridFilter']).toHaveBeenCalledWith(
        'some params'
      );

      expect(component.activeNavigationLevel).toEqual({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
      });
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });
  });

  describe('setParamAgGridFilter', () => {
    it('should do nothing if filterModel is not defined', () => {
      const mockFilterString = 'some filter';
      const spy = jest.spyOn(JSON, 'parse');
      // eslint-disable-next-line unicorn/no-useless-undefined
      spy.mockImplementationOnce(() => undefined);

      component['setParamAgGridFilter'](mockFilterString);

      expect(dataFacade.setAgGridFilter).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should dispatch agGridFilter and set list controls if filter is defined', () => {
      const mockFilterString = 'some filter';
      const mockFilterValue = ['some filter value'];
      const mockFilterModel = {
        materialStandardMaterialNameHiddenFilter: { values: mockFilterValue },
        materialStandardStandardDocumentHiddenFilter: {
          values: mockFilterValue,
        },
        materialNumbers: { values: mockFilterValue },
      };
      const spy = jest.spyOn(JSON, 'parse');
      spy.mockImplementationOnce(() => mockFilterModel);

      component['setParamAgGridFilter'](mockFilterString);

      expect(dataFacade.setAgGridFilter).toHaveBeenLastCalledWith(
        mockFilterModel
      );

      spy.mockRestore();
    });
  });
});

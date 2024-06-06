import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  SimpleChanges,
} from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { DataFacade } from '@mac/msd/store/facades/data';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import * as en from '../../../../../../assets/i18n/en.json';
import { MsdAgGridStateService } from '../../../services';
import { MsdNavigationComponent } from './msd-navigation.component';

@Injectable()
class MockDataFacade extends DataFacade {
  setNavigation = jest.fn();
}

describe('MsdNavigationComponent', () => {
  let component: MsdNavigationComponent;
  let spectator: Spectator<MsdNavigationComponent>;
  let dataFacade: DataFacade;
  let msdAgGridStateService: MsdAgGridStateService;

  const createComponent = createComponentFactory({
    component: MsdNavigationComponent,
    imports: [provideTranslocoTestingModule({ en })],
    detectChanges: false,
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            data: initialState,
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
        },
      }),
      MockProvider(DataFacade, MockDataFacade, 'useClass'),
      mockProvider(MsdAgGridStateService),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dataFacade = spectator.inject(DataFacade);
    msdAgGridStateService = spectator.inject(MsdAgGridStateService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch the active navigation, set from outside', () => {
      const activeNavigationLevel = {
        materialClass: MaterialClass.COPPER,
        navigationLevel: NavigationLevel.STANDARD,
      };
      msdAgGridStateService.getLastActiveNavigationLevel = jest.fn();

      component.activeNavigationLevel = activeNavigationLevel;
      component.ngOnInit();

      expect(
        msdAgGridStateService.getLastActiveNavigationLevel
      ).not.toHaveBeenCalled();
      expect(dataFacade.setNavigation).toHaveBeenCalledWith(
        activeNavigationLevel.materialClass,
        activeNavigationLevel.navigationLevel
      );
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith(expect.any(String), { ...activeNavigationLevel });
    });

    it('should dispatch the last active navigation', () => {
      const lastActiveNavigationLevel = {
        materialClass: MaterialClass.POLYMER,
        navigationLevel: NavigationLevel.MATERIAL,
      };

      msdAgGridStateService.getLastActiveNavigationLevel = jest.fn(
        () => lastActiveNavigationLevel
      );

      component.activeNavigationLevel = undefined;
      component.ngOnInit();

      expect(
        msdAgGridStateService.getLastActiveNavigationLevel
      ).toHaveBeenCalledTimes(1);
      expect(dataFacade.setNavigation).toHaveBeenCalledWith(
        lastActiveNavigationLevel.materialClass,
        lastActiveNavigationLevel.navigationLevel
      );
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith(expect.any(String), {
        ...lastActiveNavigationLevel,
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should do nothing if activeNavigationLevel has not been changed', () => {
      jest.resetAllMocks();
      msdAgGridStateService.storeActiveNavigationLevel = jest.fn();

      component.ngOnChanges({
        someValue: {
          currentValue: 'test',
        },
      } as unknown as SimpleChanges);

      expect(
        msdAgGridStateService.storeActiveNavigationLevel
      ).not.toHaveBeenCalled();
      expect(dataFacade.setNavigation).not.toHaveBeenCalled();
      expect(
        component['applicationInsightsService'].logEvent
      ).not.toHaveBeenCalled();
    });

    it('should do nothing if activeNavigationLevel is undefined', () => {
      msdAgGridStateService.storeActiveNavigationLevel = jest.fn();
      component.activeNavigationLevel = undefined;

      component.ngOnChanges({
        activeNavigationLevel: {
          currentValue: undefined,
        },
      } as unknown as SimpleChanges);

      expect(
        msdAgGridStateService.storeActiveNavigationLevel
      ).not.toHaveBeenCalled();
      expect(dataFacade.setNavigation).not.toHaveBeenCalled();
    });

    it('should load data and store last active navigation level', () => {
      const activeNavigationLevel = {
        materialClass: MaterialClass.COPPER,
        navigationLevel: NavigationLevel.STANDARD,
      };

      msdAgGridStateService.storeActiveNavigationLevel = jest.fn();
      component.activeNavigationLevel = activeNavigationLevel;

      component.ngOnChanges({
        activeNavigationLevel: {
          currentValue: activeNavigationLevel,
        },
      } as unknown as SimpleChanges);

      expect(
        msdAgGridStateService.storeActiveNavigationLevel
      ).toHaveBeenCalledWith(activeNavigationLevel);
      expect(dataFacade.setNavigation).toHaveBeenCalledWith(
        activeNavigationLevel.materialClass,
        activeNavigationLevel.navigationLevel
      );
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith(expect.any(String), { ...activeNavigationLevel });
    });
  });

  describe('setActive', () => {
    it('should dispatch the action with the given values', () => {
      const activeNavigationLevel = {
        materialClass: MaterialClass.ALUMINUM,
        navigationLevel: NavigationLevel.SUPPLIER,
      };
      msdAgGridStateService.storeActiveNavigationLevel = jest.fn();

      component.setActive(
        activeNavigationLevel.materialClass,
        activeNavigationLevel.navigationLevel
      );

      expect(dataFacade.setNavigation).toHaveBeenCalledWith(
        activeNavigationLevel.materialClass,
        activeNavigationLevel.navigationLevel
      );
      expect(
        msdAgGridStateService.storeActiveNavigationLevel
      ).toHaveBeenCalledWith(activeNavigationLevel);
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith(expect.any(String), { ...activeNavigationLevel });
    });

    it('should dispatch the action with default values', () => {
      const materialClass = MaterialClass.ALUMINUM;
      const defaultActiveNavigationLevel = {
        materialClass,
        navigationLevel: NavigationLevel.MATERIAL,
      };
      msdAgGridStateService.storeActiveNavigationLevel = jest.fn();

      component.setActive(materialClass);

      expect(dataFacade.setNavigation).toHaveBeenCalledWith(
        defaultActiveNavigationLevel.materialClass,
        defaultActiveNavigationLevel.navigationLevel
      );
      expect(
        msdAgGridStateService.storeActiveNavigationLevel
      ).toHaveBeenCalledWith(defaultActiveNavigationLevel);
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith(expect.any(String), {
        ...defaultActiveNavigationLevel,
      });
    });
  });

  describe('toggleSideBar', () => {
    it('should change the minimized value', () => {
      expect(component.minimized).toBe(false);

      component.toggleSideBar();

      expect(component.minimized).toBe(true);
    });
  });

  describe('hasNavigationLevels', () => {
    it('should return true if class is not sap', () => {
      const result = component.hasNavigationLevels(MaterialClass.STEEL);

      expect(result).toBe(true);
    });

    it('should return false if class is sap', () => {
      const result = component.hasNavigationLevels(MaterialClass.SAP_MATERIAL);

      expect(result).toBe(false);
    });
  });
});

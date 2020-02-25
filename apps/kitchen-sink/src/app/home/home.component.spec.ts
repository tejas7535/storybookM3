import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import {
  BannerModule,
  BannerState,
  openBanner,
  SnackBarModule,
  SnackBarService,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import * as en from '../../assets/i18n/en.json';

import { RouterStateUrl } from '../core/store';
import { SidebarState } from '../core/store/reducers/sidebar/sidebar.reducer';
import { HomeComponent } from './home.component';

interface AppState {
  sidebar: SidebarState;
  router: RouterReducerState<RouterStateUrl>;
  banner: BannerState;
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore<{ banner: BannerState }>;
  let snackBarService: SnackBarService;

  const initialBannerState: BannerState = {
    text: undefined,
    buttonText: undefined,
    truncateSize: undefined,
    showFullText: false,
    open: false
  };

  const initialSidebarState: SidebarState = {
    mode: 0
  };

  const initialState: AppState = {
    banner: initialBannerState,
    sidebar: initialSidebarState,
    router: undefined
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        NoopAnimationsModule,
        SnackBarModule,
        SpeedDialFabModule,
        StoreModule.forRoot({}),
        provideTranslocoTestingModule({ en }),
        BannerModule
      ],
      providers: [
        provideMockStore({
          initialState
        })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store) as MockStore<{ banner: BannerState }>;
    snackBarService = TestBed.inject(SnackBarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      translate('navigation.home')
    );
  });

  describe('ngOnInit', () => {
    it('should call openBanner', () => {
      spyOn(component, 'openBanner');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.openBanner).toHaveBeenCalled();
    });
  });

  describe('openBanner', () => {
    it('should dispatch openBanner action', () => {
      spyOn(store, 'dispatch');

      component.openBanner();

      expect(store.dispatch).toHaveBeenCalledWith(
        openBanner({
          text: translate('banner.bannerText'),
          buttonText: translate('banner.buttonText'),
          truncateSize: 120
        })
      );
    });
  });

  describe('showSuccessToast', () => {
    it('should call method ShowSuccessMessage of snackbarService', () => {
      snackBarService.showSuccessMessage = jest
        .fn()
        .mockReturnValue(of('action'));

      component.showSuccessToast();

      expect(snackBarService.showSuccessMessage).toHaveBeenCalled();
    });
  });

  describe('showInformationToast', () => {
    it('should call method ShowInfoMessage of snackbarService', () => {
      snackBarService.showInfoMessage = jest.fn();

      component.showInformationToast();

      expect(snackBarService.showInfoMessage).toHaveBeenCalled();
    });
  });

  describe('showSuccessWarningToast', () => {
    const mockReturnValue = (value: string) => {
      snackBarService.showWarningMessage = jest.fn().mockReturnValue(of(value));
    };

    it('should call method ShowWarningMessage of snackbarService', () => {
      mockReturnValue('dismiss');

      component.showWarningToast();

      expect(snackBarService.showWarningMessage).toHaveBeenCalled();
    });

    it('should open success toast when user clicked try again', () => {
      mockReturnValue('action');
      component.showSuccessToast = jest.fn();

      component.showWarningToast();

      expect(component.showSuccessToast).toHaveBeenCalled();
    });
  });

  describe('showErrorToast', () => {
    it('should call method ShowErrorMessage of snackbarService', () => {
      snackBarService.showErrorMessage = jest.fn();

      component.showErrorToast();

      expect(snackBarService.showErrorMessage).toHaveBeenCalled();
    });
  });

  describe('speedDialFabClicked', () => {
    it('should toggle speedDialFabOpen on fab open', () => {
      const key = 'conversation';

      expect(component.speedDialFabOpen).toBeFalsy();

      component.speedDialFabClicked(key);

      expect(component.speedDialFabOpen).toBeTruthy();
    });

    it('should toggle speedDialFabOpen on fab close', () => {
      const key = 'cancel';
      component.speedDialFabOpen = true;

      component.speedDialFabClicked(key);

      expect(component.speedDialFabOpen).toBeFalsy();
    });
  });
});

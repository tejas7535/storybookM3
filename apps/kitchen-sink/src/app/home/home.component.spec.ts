import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { translate } from '@ngneat/transloco';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import {
  BannerModule,
  BannerState,
  BannerTextComponent,
  SnackBarModule,
  SnackBarService,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { CustomBannerComponent } from '../shared/components/custom-banner/custom-banner.component';
import { HomeComponent } from './home.component';

import { SidebarState } from '../core/store/reducers/sidebar/sidebar.reducer';

import * as en from '../../assets/i18n/en.json';
import { AppState } from '../core/store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore<AppState>;
  let snackBarService: SnackBarService;

  const initialBannerState: BannerState = {
    text: '',
    buttonText: 'OK',
    truncateSize: 120,
    isFullTextShown: false,
    open: undefined,
    url: undefined
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

    store = TestBed.get(Store);
    snackBarService = TestBed.get(SnackBarService);
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

  describe('bannerHandling', () => {
    it('should dispatch openBanner action on openBanner', () => {
      const banner = {
        component: BannerTextComponent,
        text: translate('banner.bannerText'),
        buttonText: translate('banner.buttonText'),
        truncateSize: 120,
        type: '[Banner] Open Banner'
      };
      const spy = spyOn(store, 'dispatch');
      component.openBanner();
      expect(spy).toHaveBeenCalledWith(banner);
    });

    it('should dispatch openBanner action on openCustomBanner', () => {
      const banner = {
        component: CustomBannerComponent,
        text: translate('customBanner.bannerText'),
        buttonText: translate('customBanner.buttonText'),
        truncateSize: 0,
        type: '[Banner] Open Banner'
      };
      const spy = spyOn(store, 'dispatch');
      component.openCustomBanner();
      expect(spy).toHaveBeenCalledWith(banner);
    });

    it('should call openCustomBanner on closing the first banner', () => {
      const spy = spyOn(component, 'openCustomBanner');
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      store.setState({
        ...initialState,
        banner: {
          ...initialState.banner,
          open: false
        }
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});

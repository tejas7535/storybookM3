import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoModule } from '@ngneat/transloco';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

import {
  BannerModule,
  BannerState,
  BannerTextComponent,
  SnackBarModule,
  SnackBarService,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import { AppState } from '../core/store';
import { SidebarState } from '../core/store/reducers/sidebar/sidebar.reducer';
import { CustomBannerComponent } from '../shared/components/custom-banner/custom-banner.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
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
        TranslocoModule,
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
    debugElement = fixture.debugElement;
    fixture.detectChanges();

    store = TestBed.get(Store);
    snackBarService = TestBed.get(SnackBarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();

    // TODO: Use Transloco Testing Module
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'en.NAVIGATION.HOME'
    );
  });

  describe('showSuccessToast', () => {
    it('should call method ShowSuccessMessage of snackbarService', () => {
      snackBarService.showSuccessMessage = jest.fn();

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
    it('should log clicked button key', () => {
      const key = 'edit';
      console.log = jest.fn();

      component.speedDialFabClicked(key);

      expect(console.log).toHaveBeenCalledWith(
        'Speed Dial FAB has been clicked:',
        key
      );
    });

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
        text: 'BANNER.BANNER_TEXT',
        buttonText: 'BANNER.BUTTON_TEXT',
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
        text: 'CUSTOM_BANNER.BANNER_TEXT',
        buttonText: 'CUSTOM_BANNER.BUTTON_TEXT',
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

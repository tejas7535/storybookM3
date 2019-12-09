import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  BannerState,
  BannerTextComponent,
  SnackBarModule,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { CustomBannerComponent } from '../shared/components/custom-banner/custom-banner.component';
import { HomeComponent } from './home.component';

import { SidebarState } from '../core/store/reducers/sidebar/sidebar.reducer';

import { AppState } from '../core/store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let store: MockStore<AppState>;

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
        BrowserAnimationsModule,
        MatSnackBarModule,
        SnackBarModule,
        SpeedDialFabModule,
        TranslocoModule
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

  describe('Snackbar', () => {
    it('should be opened upon openSnackbar method call', () => {
      const matSnackBar = TestBed.get(MatSnackBar);
      const spy = spyOn(matSnackBar, 'openFromComponent').and.returnValue({
        instance: { snackBarRef: {} }
      });

      component.openSnackbar();

      expect(spy).toHaveBeenCalled();
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

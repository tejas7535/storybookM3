import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { BannerModule, BannerState } from '@schaeffler/banner';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import {
  ScrollToTopModule,
  SettingsSidebarModule,
} from '@schaeffler/shared/ui-components';
import { SidebarMode, SidebarModule, SidebarState } from '@schaeffler/sidebar';
import { SnackBarModule } from '@schaeffler/snackbar';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../assets/i18n/en.json';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const initialBannerState: BannerState = {
    text: undefined,
    buttonText: undefined,
    icon: undefined,
    truncateSize: undefined,
    showFullText: false,
    open: false,
  };

  const initialSidebarState: SidebarState = {
    mode: SidebarMode.Open,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FooterModule,
        ScrollToTopModule,
        SnackBarModule,
        RouterTestingModule,
        HeaderModule,
        SidebarModule,
        SettingsSidebarModule,
        BannerModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        provideTranslocoTestingModule({ en }),
      ],
      providers: [
        provideMockStore({
          initialState: {
            banner: initialBannerState,
            sidebar: initialSidebarState,
          },
        }),
      ],
    });
  });

  beforeEach(() => {
    spyOn(transloco, 'translate').and.returnValue('test');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set variables properly', () => {
    expect(component.platformTitle).toEqual('test');
  });

  describe('onChangeSettingsSidebar()', () => {
    it('should log to console when called', () => {
      jest.spyOn(console, 'log');
      component.onChangeSettingsSidebar(true);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('userMenuClicked()', () => {
    it('should log to console', () => {
      jest.spyOn(console, 'log');
      component.userMenuClicked('lala');
      expect(console.log).toHaveBeenCalled();
    });
  });
});

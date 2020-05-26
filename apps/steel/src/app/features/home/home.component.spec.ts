import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { BannerModule, BannerState } from '@schaeffler/banner';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { ScrollToTopModule } from '@schaeffler/shared/ui-components';
import { SidebarMode, SidebarModule, SidebarState } from '@schaeffler/sidebar';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../assets/i18n/en.json';
import { AppState, StoreModule } from '../../core/store';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore<AppState>;

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
      imports: [
        FooterModule,
        HeaderModule,
        MatIconModule,
        HttpClientTestingModule,
        MatButtonModule,
        RouterTestingModule,
        SidebarModule,
        ScrollToTopModule,
        NoopAnimationsModule,
        StoreModule,
        BannerModule,
        provideTranslocoTestingModule({ en }),
      ],
      declarations: [HomeComponent],
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
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;

    store = TestBed.inject(Store) as MockStore<AppState>;
  });

  test('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    test('should call openBanner', () => {
      component.openBanner = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.openBanner).toHaveBeenCalled();
    });
  });

  describe('openBanner', () => {
    it('should dispatch openBanner action', () => {
      const banner = {
        text: transloco.translate('disclaimer'),
        buttonText: transloco.translate('disclaimerClose'),
        icon: 'info',
        truncateSize: 0,
        type: '[Banner] Open Banner',
      };
      store.dispatch = jest.fn();

      component.openBanner();
      expect(store.dispatch).toHaveBeenCalledWith(banner);
    });
  });
});

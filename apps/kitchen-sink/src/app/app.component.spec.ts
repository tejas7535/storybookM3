import { Observable, Subscriber } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import {
  BannerModule,
  BannerState,
  FooterModule,
  HeaderModule,
  ScrollToTopModule,
  SettingsSidebarModule,
  SidebarMode,
  SidebarModule,
  SidebarService,
  SnackBarModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { AppComponent } from './app.component';

import { initialState as initialSidebarState } from './core/store/reducers/sidebar/sidebar.reducer';

import * as en from '../assets/i18n/en.json';
import { AppState, toggleSidebar } from './core/store';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore<AppState>;
  let sidebarService: SidebarService;
  let breakpointObserverMock: Subscriber<any>;

  const initialBannerState: BannerState = {
    text: '',
    buttonText: 'OK',
    truncateSize: 120,
    isFullTextShown: false,
    open: undefined,
    url: undefined
  };

  /**
   * Fake Observer to emit fake stuff
   */
  const fakeObservable = new Observable(observer => {
    breakpointObserverMock = observer;

    return {
      unsubscribe(): any {}
    };
  });

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
        StoreModule.forRoot({}),
        provideTranslocoTestingModule({ en })
      ],
      providers: [
        provideMockStore({
          initialState: {
            sidebar: initialSidebarState,
            banner: initialBannerState
          }
        }),
        SidebarService,
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    spyOn(transloco, 'translate').and.returnValue('test');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    sidebarService = TestBed.get(SidebarService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set variables properly', () => {
    expect(component.platformTitle).toEqual('test');
  });

  describe('OnInit', () => {
    it('should call method handleSidebarMode()', () => {
      component['handleSidebarMode'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['handleSidebarMode']).toHaveBeenCalled();
    });
  });

  describe('onChangeSettingsSidebar()', () => {
    it('should log to console when called', () => {
      jest.spyOn(console, 'log');
      component.onChangeSettingsSidebar(true);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('toggleSidebar()', () => {
    it('should dispatch ToggleSidebarAction()', () => {
      const sidebarMode = SidebarMode.Open;
      spyOn(sidebarService, 'getSidebarMode').and.returnValue(fakeObservable);
      const spy = spyOn(component['store'], 'dispatch');

      component.toggleSidebar();
      breakpointObserverMock.next(sidebarMode);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        toggleSidebar({ sidebarMode: SidebarMode.Open })
      );
    });

    it('should only dispatch in one time ToggleSidebarAction()', () => {
      spyOn(sidebarService, 'getSidebarMode').and.returnValue(fakeObservable);
      const spy = spyOn(component['store'], 'dispatch');
      component.toggleSidebar();

      breakpointObserverMock.next(SidebarMode.Open);
      expect(spy).toHaveBeenCalledWith(
        toggleSidebar({ sidebarMode: SidebarMode.Open })
      );

      breakpointObserverMock.next(SidebarMode.Closed);
      expect(spy).not.toHaveBeenCalledWith(
        toggleSidebar({ sidebarMode: SidebarMode.Closed })
      );
    });
  });

  describe('handleSidebarMode', () => {
    it('should subscribe to getSidebarMode', () => {
      const spy = spyOn(sidebarService, 'getSidebarMode').and.callThrough();

      component['handleSidebarMode']();

      expect(spy).toHaveBeenCalled();
    });
  });
});

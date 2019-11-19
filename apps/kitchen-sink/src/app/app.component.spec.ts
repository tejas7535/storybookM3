import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { Observable, Subscriber } from 'rxjs';

import {
  FooterModule,
  HeaderModule,
  ScrollToTopModule,
  SettingsSidebarModule,
  SidebarMode,
  SidebarModule,
  SidebarService,
  SnackBarModule
} from '@schaeffler/shared/ui-components';

import { AppComponent } from './app.component';
import { AppState, toggleSidebar } from './core/store';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore<AppState>;
  let sidebarService: SidebarService;
  let breakpointObserverMock: Subscriber<any>;

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
        SettingsSidebarModule
      ],
      providers: [
        provideMockStore(),
        SidebarService,
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
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
    expect(component.platformTitle).toEqual('GENERAL.APP_NAME');
  });

  describe('OnInit', () => {
    it('should call method handleSidebarMode()', () => {
      component['handleSidebarMode'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['handleSidebarMode']).toHaveBeenCalled();
    });
  });

  describe('logoutUser()', () => {
    it('should log to console when logoutUser is triggered', () => {
      jest.spyOn(console, 'log');
      component.logoutUser();
      expect(console.log).toHaveBeenCalled();
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

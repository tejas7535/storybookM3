import { async, TestBed } from '@angular/core/testing';
import { ActivationEnd, Router } from '@angular/router';

import { of } from 'rxjs';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { configureTestSuite } from 'ng-bullet';

import { SidebarMode, Viewport } from '../../models';
import { SidebarService } from '../../sidebar.service';
import { setSidebarMode, toggleSidebar } from '../actions/sidebar.actions';
import { SidebarState } from '../reducers/sidebar.reducer';
import { getSidebarMode } from '../selectors/sidebar.selectors';
import { SidebarEffects } from './sidebar.effects';

interface State {
  sidebar: SidebarState;
}

describe('SidebarEffects', () => {
  let action: Action;
  let actions$: Actions;
  let store: MockStore<State>;
  let sidebarEffects: SidebarEffects;
  let sidebarService: SidebarService;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SidebarEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: SidebarService,
          useValue: {
            getSidebarMode: jest.fn(() => of(SidebarMode.Closed)),
            getViewport: jest.fn(() => of(Viewport.Large)),
          },
        },
        {
          provide: Router,
          useValue: {
            events: of(new ActivationEnd(undefined)),
          },
        },
      ],
    });
  });

  beforeEach(async(() => {
    store = TestBed.inject(MockStore);
    actions$ = TestBed.inject(Actions);
    sidebarEffects = TestBed.inject(SidebarEffects);
    sidebarService = TestBed.inject(SidebarService);
    router = TestBed.inject(Router);
  }));

  describe('setSidebarState$', () => {
    it('should return setSidebarMode Action', (done) => {
      sidebarEffects.setSidebarState$.subscribe((result) => {
        expect(result).toEqual(
          setSidebarMode({ sidebarMode: SidebarMode.Closed })
        );
        done();
      });
    });
  });

  describe('toggleSidebar$', () => {
    beforeEach(() => {
      action = toggleSidebar();
    });

    it('should return setSidebarMode Action', () => {
      actions$ = hot('-a', { a: action });

      store.overrideSelector(getSidebarMode, SidebarMode.Open);

      const result = setSidebarMode({
        sidebarMode: SidebarMode.Minified,
      });

      const expected = cold('-b', { b: result });

      expect(sidebarEffects.toggleSidebar$).toBeObservable(expected);
    });
  });

  describe('closeSidebar$', () => {
    beforeEach(() => {
      spyOn(router, 'events').and.returnValue(of(new ActivationEnd(undefined)));
    });

    it('should return action of type no_action', (done) => {
      sidebarEffects.closeSidebar$.subscribe((result) => {
        expect(result).toEqual({ type: 'NO_ACTION' });
        done();
      });
    });

    xit('should return setSidebarMode action with param closed', (done) => {
      // overriding the mock does not work
      sidebarService.getViewport = jest.fn(() => of(Viewport.Small));

      sidebarEffects.closeSidebar$.subscribe((result) => {
        expect(result).toEqual(
          setSidebarMode({ sidebarMode: SidebarMode.Closed })
        );
        done();
      });
    });
  });

  describe('defineSidebarMode', () => {
    let currentMode: SidebarMode;
    let viewport: Viewport;
    let newMode: SidebarMode;

    it('should set to open when current mode is Closed', () => {
      currentMode = SidebarMode.Closed;
      viewport = Viewport.Small;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(SidebarMode.Open);
    });

    it('should set to open when current mode is minified', () => {
      currentMode = SidebarMode.Minified;
      viewport = Viewport.Small;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(SidebarMode.Open);
    });

    it('should set to closed when current mode is open and viewport small', () => {
      currentMode = SidebarMode.Open;
      viewport = Viewport.Small;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(SidebarMode.Closed);
    });

    it('should set to minified when current mode is open and viewport medium', () => {
      currentMode = SidebarMode.Open;
      viewport = Viewport.Medium;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(SidebarMode.Minified);
    });

    it('should set to minified when current mode is open and viewport large', () => {
      currentMode = SidebarMode.Open;
      viewport = Viewport.Large;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(SidebarMode.Minified);
    });

    it('should return current mode when viewport is undefined', () => {
      currentMode = SidebarMode.Open;
      viewport = undefined;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(SidebarMode.Open);
    });

    it('should return current mode as default', () => {
      currentMode = 4;
      viewport = Viewport.Small;

      newMode = sidebarEffects['defineSidebarMode'](currentMode, viewport);

      expect(newMode).toEqual(4);
    });
  });
});

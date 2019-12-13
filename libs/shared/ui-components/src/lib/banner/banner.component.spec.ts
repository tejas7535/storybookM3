import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslocoModule } from '@ngneat/transloco';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { configureTestSuite } from 'ng-bullet';

import { BannerModule } from './banner.module';

import { BannerComponent } from './banner.component';

import { BannerService } from './banner.service';

import {
  bannerReducer,
  BannerState,
  initialState
} from './store/reducers/banner/banner.reducer';

import { BannerContent } from '.';

@Component({
  selector: 'schaeffler-dummy-component',
  template:
    '<p class="test">{{bannerText}}</p><button (click)="closeBanner()" id="dummyButton">Zack</button>'
})
class DummyComponent extends BannerContent {
  // tslint:disable-next-line: unnecessary-constructor
  constructor(dummyStore: Store<BannerState>) {
    super(dummyStore);
  }
}

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let bannerService: BannerService;
  let router: Router;
  let store: MockStore<AppState>;

  const dummyRoutes: Routes = [
    {
      path: 'page-not-found',
      component: DummyComponent,
      data: { title: 'TestDummyComponent' }
    },
    {
      path: 'abc',
      component: DummyComponent,
      data: { title: 'TestDummyComponent' }
    }
  ];

  interface AppState {
    banner: BannerState;
  }

  const initialAppState: AppState = {
    banner: initialState
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        BannerModule,
        TranslocoModule,
        RouterTestingModule.withRoutes(dummyRoutes),
        StoreModule.forRoot({}),
        StoreModule.forFeature('banner', bannerReducer)
      ],
      providers: [
        BannerService,
        provideMockStore({
          initialState: initialAppState
        })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    bannerService = TestBed.get(BannerService);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to store to fill isBannerShown', () => {
      expect(component.isBannerShown).toEqual(undefined);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isBannerShown).toBeDefined();
    });

    it('should emit an event when the banner is closed', fakeAsync(() => {
      const spy = jest.spyOn(component.bannerClose, 'emit');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      store.setState({
        banner: {
          ...initialState,
          open: true
        }
      });
      tick();

      expect(spy).not.toHaveBeenCalled();

      store.setState({
        banner: {
          ...initialState,
          open: false
        }
      });
      tick();

      expect(spy).toHaveBeenCalled();
    }));

    it('should get the url from store', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['url']).toEqual(undefined);

      store.setState({
        banner: {
          ...initialState,
          url: 'test'
        }
      });

      expect(component['url']).toEqual('test');
    });

    it('should subscribe to bannerService and generateDynamicComponent', fakeAsync(() => {
      component['generateDynamicComponent'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['generateDynamicComponent']).not.toHaveBeenCalled();

      bannerService.bannerComponent.next({ component: DummyComponent as any });
      tick(500);

      expect(component['generateDynamicComponent']).toHaveBeenCalled();
    }));

    it('should subscribe to routerEvents', fakeAsync(() => {
      const spy = jest.spyOn(store, 'dispatch');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      router.navigate(['/page-not-found']);
      tick(500);

      expect(spy).toHaveBeenCalledWith({
        type: '[Banner] Close Banner'
      });
    }));
  });

  describe('ngOnDestroy', () => {
    test('should complete the Subject', fakeAsync(() => {
      const spy = jest.spyOn(component['destroy$'], 'complete');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      tick();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();
      tick();

      expect(spy).toHaveBeenCalled();
    }));

    test('should unsubscribe getBannerOpen', fakeAsync(() => {
      let isBannerShown;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      tick();
      component.isBannerShown.subscribe(val => {
        isBannerShown = val;
      });

      store.setState({
        banner: {
          ...initialState,
          open: true
        }
      });
      tick();

      expect(isBannerShown).toEqual(true);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      store.setState({
        banner: {
          ...initialState,
          open: false
        }
      });
      tick();

      expect(isBannerShown).toEqual(true);
    }));

    test('should unsubscribe getBannerUrl', fakeAsync(() => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      store.setState({
        banner: {
          ...initialState,
          url: 'abc'
        }
      });
      tick();

      expect(component['url']).toEqual('abc');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      store.setState({
        banner: {
          ...initialState,
          url: 'notabc'
        }
      });
      tick();

      expect(component['url']).toEqual('abc');
    }));

    test('should unsubscribe bannerService.bannerComponent', fakeAsync(() => {
      component['generateDynamicComponent'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      tick();

      bannerService.bannerComponent.next({ component: DummyComponent as any });
      tick();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();
      tick();

      bannerService.bannerComponent.next({ component: DummyComponent as any });
      tick();

      expect(component['generateDynamicComponent']).toHaveBeenCalledTimes(1);
    }));

    test('should unsubscribe router events', fakeAsync(() => {
      const spy = jest.spyOn(store, 'dispatch');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      tick();

      router.navigate(['/abc']);
      tick();

      expect(spy).toHaveBeenCalled();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();
      tick();

      router.navigate(['/page-not-found']);
      tick();

      expect(spy).toHaveBeenCalledTimes(1);
    }));
  });
});

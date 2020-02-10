import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import {
  bannerReducer,
  initialState
} from './store/reducers/banner/banner.reducer';

import { BannerContent, BannerModule, BannerState } from '.';
import * as BannerActions from './store/actions';

@Component({
  selector: 'schaeffler-dummy-component',
  template:
    '<p class="test">{{bannerText}}</p><button (click)="closeBanner()" id="dummyButton">Zack</button>'
})
class DummyComponent {
  // tslint:disable-next-line: unnecessary-constructor
  constructor(_store: Store<BannerState>) {}
}

describe('BannerContent', () => {
  let store: MockStore<AppState>;
  let bannerStore: MockStore<BannerState>;
  let bannerContent: BannerContent;
  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;

  interface AppState {
    banner: BannerState;
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        BannerModule,
        provideTranslocoTestingModule({}),
        FlexLayoutModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('banner', bannerReducer)
      ],
      providers: [provideMockStore({ initialState: { banner: initialState } })]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
    bannerStore = TestBed.get(Store);
    bannerContent = new BannerContent(bannerStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(bannerContent).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get initial state and set its attributes', () => {
      expect(bannerContent.text).toEqual(undefined);
      expect(bannerContent.buttonText).toEqual(undefined);
      expect(bannerContent.truncateSize).toEqual(undefined);
      expect(bannerContent.isFullTextShown).toEqual(undefined);

      // tslint:disable-next-line: no-lifecycle-call
      bannerContent.ngOnInit();

      expect(bannerContent.text).toEqual('');
      expect(bannerContent.buttonText).toEqual('OK');
      expect(bannerContent.truncateSize).toEqual(120);
      expect(bannerContent.isFullTextShown).toEqual(false);
    });

    it('should set its attributes according to state changes', () => {
      // tslint:disable-next-line: no-lifecycle-call
      bannerContent.ngOnInit();
      const state = { banner: { initialState } };
      let nextState;

      expect(bannerContent.text).toEqual('');
      expect(bannerContent.buttonText).toEqual('OK');
      expect(bannerContent.truncateSize).toEqual(120);
      expect(bannerContent.isFullTextShown).toEqual(false);

      nextState = {
        text: 'test',
        buttonText: 'test',
        truncateSize: 10,
        isFullTextShown: true,
        open: true,
        url: undefined
      };
      store.setState({
        ...state,
        banner: {
          ...state.banner,
          ...nextState
        }
      });

      expect(bannerContent.text).toEqual('test');
      expect(bannerContent.buttonText).toEqual('test');
      expect(bannerContent.truncateSize).toEqual(10);
      expect(bannerContent.isFullTextShown).toEqual(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete subject', async(() => {
      // tslint:disable-next-line: no-lifecycle-call
      bannerContent.ngOnInit();
      let state = { banner: { initialState } };
      let nextState;

      expect(bannerContent.text).toEqual('');
      expect(bannerContent.buttonText).toEqual('OK');
      expect(bannerContent.truncateSize).toEqual(120);
      expect(bannerContent.isFullTextShown).toEqual(false);

      nextState = {
        text: 'test',
        buttonText: 'test',
        truncateSize: 10,
        isFullTextShown: true,
        open: true,
        url: undefined
      };
      store.setState({
        ...state,
        banner: {
          ...state.banner,
          ...nextState
        }
      });
      state = {
        ...state,
        banner: {
          ...state.banner,
          ...nextState
        }
      };

      expect(bannerContent.text).toEqual('test');
      expect(bannerContent.buttonText).toEqual('test');
      expect(bannerContent.truncateSize).toEqual(10);
      expect(bannerContent.isFullTextShown).toEqual(true);

      // tslint:disable-next-line: no-lifecycle-call
      bannerContent.ngOnDestroy();

      nextState = {
        text: '',
        buttonText: '',
        truncateSize: 100,
        isFullTextShown: false,
        open: true,
        url: undefined
      };
      store.setState({
        ...state,
        banner: {
          ...state.banner,
          ...nextState
        }
      });
      state = {
        ...state,
        banner: {
          ...state.banner,
          ...nextState
        }
      };

      expect(bannerContent.text).toEqual('test');
      expect(bannerContent.buttonText).toEqual('test');
      expect(bannerContent.truncateSize).toEqual(10);
      expect(bannerContent.isFullTextShown).toEqual(true);
    }));
  });

  describe('closeBanner', () => {
    it('should dispatch action on closeBanner', () => {
      const spy = jest.spyOn(bannerContent['store'], 'dispatch');

      bannerContent.closeBanner();

      expect(spy).toHaveBeenCalledWith(BannerActions.closeBanner());
    });
  });

  describe('toggleFullText', () => {
    test('should dispatch action on toggleFullText', async(() => {
      // tslint:disable-next-line: no-lifecycle-call
      bannerContent.ngOnInit();
      const spy = jest.spyOn(store, 'dispatch');
      bannerContent.toggleFullText();

      expect(spy).toHaveBeenCalledWith({
        isFullTextShown: true,
        type: '[Banner] Toggle Full Text'
      });

      bannerContent.isFullTextShown = true;
      bannerContent.toggleFullText();

      expect(spy).toHaveBeenCalledWith({
        isFullTextShown: false,
        type: '[Banner] Toggle Full Text'
      });
    }));
  });
});

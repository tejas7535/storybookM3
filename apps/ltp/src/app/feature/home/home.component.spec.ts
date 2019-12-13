import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import {
  BannerModule,
  BannerState,
  BannerTextComponent
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { PredictionModule } from '../prediction/prediction.module';

import { HomeComponent } from './home.component';

import { initialState as initialInputState } from '../../core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../../core/store/reducers/prediction.reducer';

import { LTPState } from '../../core/store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore<LTPState>;

  const initialBannerState: BannerState = {
    text: '',
    buttonText: 'OK',
    truncateSize: 120,
    isFullTextShown: false,
    open: undefined,
    url: undefined
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        StoreModule.forRoot({}),
        FlexLayoutModule,
        RouterTestingModule,
        PredictionModule,
        BannerModule
      ],
      providers: [
        provideMockStore({
          initialState: {
            input: initialInputState,
            prediction: initialPredictionState,
            banner: initialBannerState
          }
        })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
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
        component: BannerTextComponent,
        text: 'DISCLAIMER',
        buttonText: 'DISCLAIMER_CLOSE',
        truncateSize: 0,
        type: '[Banner] Open Banner'
      };
      store.dispatch = jest.fn();

      component.openBanner();
      expect(store.dispatch).toHaveBeenCalledWith(banner);
    });
  });
});

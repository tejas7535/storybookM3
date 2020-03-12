import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { translate } from '@ngneat/transloco';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import { BannerModule, BannerState } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { PredictionModule } from '../prediction/prediction.module';

import { HomeComponent } from './home.component';

import { initialState as initialInputState } from '../../core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../../core/store/reducers/prediction.reducer';

import * as en from '../../../assets/i18n/en.json';
import { LTPState } from '../../core/store';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore<LTPState>;

  const initialBannerState: BannerState = {
    text: undefined,
    buttonText: undefined,
    icon: undefined,
    truncateSize: undefined,
    showFullText: false,
    open: false
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        FlexLayoutModule,
        RouterTestingModule,
        PredictionModule,
        BannerModule,
        provideTranslocoTestingModule({ en })
      ],
      providers: [
        provideMockStore({
          initialState: {
            input: initialInputState,
            prediction: initialPredictionState,
            banner: initialBannerState
          }
        }),
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    store = TestBed.inject(Store) as MockStore<LTPState>;
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
        text: translate('disclaimer'),
        icon: 'info',
        buttonText: translate('disclaimerClose'),
        truncateSize: 0,
        type: '[Banner] Open Banner'
      };
      store.dispatch = jest.fn();

      component.openBanner();
      expect(store.dispatch).toHaveBeenCalledWith(banner);
    });
  });
});

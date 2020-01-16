import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { BannerTextComponent } from './banner-text.component';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';

import {
  BannerState,
  initialState
} from '../store/reducers/banner/banner.reducer';

describe('BannerTextComponent', () => {
  let component: BannerTextComponent;
  let fixture: ComponentFixture<BannerTextComponent>;
  let store: MockStore<BannerState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BannerTextComponent, TruncatePipe],
      imports: [
        provideTranslocoTestingModule({}),
        FlexLayoutModule,
        StoreModule
      ],
      providers: [
        provideMockStore({
          initialState: {
            banner: initialState
          }
        })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

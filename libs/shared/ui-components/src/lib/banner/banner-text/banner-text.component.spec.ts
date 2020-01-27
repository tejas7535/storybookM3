import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { BannerTextComponent } from './banner-text.component';

import { TruncatePipe } from '../truncate-pipe/truncate.pipe';

import { initialState } from '../store/reducers/banner/banner.reducer';

describe('BannerTextComponent', () => {
  let component: BannerTextComponent;
  let fixture: ComponentFixture<BannerTextComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

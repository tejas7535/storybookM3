import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { PRICE_DETAILS_MOCK } from '../../../testing/mocks/price-details.mock';
import { getPriceDetails } from '../../core/store/selectors/details/detail.selector';
import { PricingComponent } from './pricing.component';

describe('PricingComponent', () => {
  let component: PricingComponent;
  let fixture: ComponentFixture<PricingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [PricingComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getPriceDetails,
              value: PRICE_DETAILS_MOCK,
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

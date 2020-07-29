import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_DETAILS_MOCK } from '../../../../testing/mocks';
import { getDimensionAndWeightDetails } from '../../../core/store/selectors';
import { CustomerComponent } from './customer.component';

describe('DimensionAndWeightComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [CustomerComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getDimensionAndWeightDetails,
              value: CUSTOMER_DETAILS_MOCK,
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

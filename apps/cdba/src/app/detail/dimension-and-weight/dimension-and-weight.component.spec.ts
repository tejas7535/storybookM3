import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DIMENSION_AND_WEIGHT_DETAILS_MOCK } from '../../../testing/mocks';
import { getDimensionAndWeightDetails } from '../../core/store/selectors/details/detail.selector';
import { DimensionAndWeightComponent } from './dimension-and-weight.component';

describe('DimensionAndWeightComponent', () => {
  let component: DimensionAndWeightComponent;
  let fixture: ComponentFixture<DimensionAndWeightComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [DimensionAndWeightComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getDimensionAndWeightDetails,
              value: DIMENSION_AND_WEIGHT_DETAILS_MOCK,
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionAndWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

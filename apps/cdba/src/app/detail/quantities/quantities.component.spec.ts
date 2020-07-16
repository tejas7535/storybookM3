import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QUANTITIES_DETAILS_MOCK } from '../../../testing/mocks';
import { getQuantitiesDetails } from '../../core/store/selectors/details/detail.selector';
import { QuantitiesComponent } from './quantities.component';

describe('QuantitiesComponent', () => {
  let component: QuantitiesComponent;
  let fixture: ComponentFixture<QuantitiesComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [QuantitiesComponent],
      providers: [
        provideMockStore({
          initialState: {
            detail: {},
          },
          selectors: [
            {
              selector: getQuantitiesDetails,
              value: QUANTITIES_DETAILS_MOCK,
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

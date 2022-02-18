import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailTabComponent } from './detail-tab.component';

describe('DetailTabComponent', () => {
  let spectator: Spectator<DetailTabComponent>;
  let component: DetailTabComponent;

  const createComponent = createComponentFactory({
    component: DetailTabComponent,
    imports: [
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LoadingSpinnerModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set observables', () => {
      component.ngOnInit();

      expect(component.isLoading$).toBeDefined();
      expect(component.customerDetails$).toBeDefined();
      expect(component.dimensionAndWeightDetails$).toBeDefined();
      expect(component.priceDetails$).toBeDefined();
      expect(component.productionDetails$).toBeDefined();
      expect(component.quantitiesDetails$).toBeDefined();
      expect(component.salesDetails$).toBeDefined();
    });
  });
});

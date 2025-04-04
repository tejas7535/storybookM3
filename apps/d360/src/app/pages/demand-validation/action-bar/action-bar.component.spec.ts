import { PlanningView } from '../../../feature/demand-validation/planning-view';
import { CustomerEntry } from '../../../feature/global-selection/model';
import { Stub } from '../../../shared/test/stub.class';
import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;

  beforeEach(() => {
    component = Stub.getForEffect<ActionBarComponent>({
      component: ActionBarComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getStoreProvider(),
        Stub.getDemandValidationServiceProvider(),
        Stub.getUserServiceProvider(),
      ],
    });

    Stub.setInputs([
      { property: 'selectedCustomer', value: {} as CustomerEntry },
      { property: 'customerData', value: [] },
      { property: 'planningView', value: PlanningView.REQUESTED },
      {
        property: 'demandValidationFilters',
        value: {
          customerMaterialNumber: [],
          productLine: [],
          productionLine: [],
          stochasticType: [],
        },
      },
      { property: 'isMaterialListVisible', value: true },
      { property: 'changedKPIs', value: null },
    ]);
    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

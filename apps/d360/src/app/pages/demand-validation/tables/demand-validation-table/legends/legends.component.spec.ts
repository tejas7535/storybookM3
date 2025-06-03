import { Stub } from '../../../../../shared/test/stub.class';
import { LegendsComponent } from './legends.component';

describe('LegendsComponent', () => {
  let component: LegendsComponent;

  beforeEach(async () => {
    component = Stub.get<LegendsComponent>({
      component: LegendsComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('items to be defined correctly', () => {
    expect(component['items']).toEqual([
      {
        class: 'schaeffler-color',
        text: 'validation_of_demand.legend.current_date',
      },
      {
        class: 'error-color',
        text: 'validation_of_demand.legend.frozen_zone',
      },
      {
        class: 'warning-color',
        text: 'validation_of_demand.legend.replenishment_lead_time',
      },
    ]);
  });
});

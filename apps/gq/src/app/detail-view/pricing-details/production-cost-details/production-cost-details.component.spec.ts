import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { ProductionCostDetailsComponent } from './production-cost-details.component';

describe('ProductionCostDetailsComponent', () => {
  let component: ProductionCostDetailsComponent;
  let spectator: Spectator<ProductionCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: ProductionCostDetailsComponent,
    imports: [
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
      SharedPipesModule,
    ],
    providers: [provideMockStore({})],
    declarations: [ProductionCostDetailsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { HorizontalSeparatorModule } from '@schaeffler/horizontal-separator';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialAlternativeCostDetailsComponent } from './material-alternative-cost-details.component';

describe('MaterialAlternativeCostDetailsComponent', () => {
  let component: MaterialAlternativeCostDetailsComponent;
  let spectator: Spectator<MaterialAlternativeCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialAlternativeCostDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      ReactiveComponentModule,
      HorizontalSeparatorModule,
    ],
    providers: [
      provideMockStore({ initialState: { materialAlternativeCosts: {} } }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

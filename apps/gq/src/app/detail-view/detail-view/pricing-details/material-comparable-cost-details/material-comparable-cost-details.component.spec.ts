import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details.component';

describe('MaterialComparableCostDetailsComponent', () => {
  let component: MaterialComparableCostDetailsComponent;
  let spectator: Spectator<MaterialComparableCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialComparableCostDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      ReactiveComponentModule,
      MatCardModule,
      LabelTextModule,
    ],
    providers: [
      provideMockStore({ initialState: { materialComparableCosts: {} } }),
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

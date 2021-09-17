import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
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
      MatCardModule,
      LabelTextModule,
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

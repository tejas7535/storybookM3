import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialAlternativeCostDetailsComponent } from './material-alternative-cost-details.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('MaterialAlternativeCostDetailsComponent', () => {
  let component: MaterialAlternativeCostDetailsComponent;
  let spectator: Spectator<MaterialAlternativeCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialAlternativeCostDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

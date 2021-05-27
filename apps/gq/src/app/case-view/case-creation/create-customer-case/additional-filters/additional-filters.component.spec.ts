import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AdditionalFiltersComponent } from './additional-filters.component';

describe('AdditionalFiltersComponent', () => {
  let component: AdditionalFiltersComponent;
  let spectator: Spectator<AdditionalFiltersComponent>;

  const createComponent = createComponentFactory({
    component: AdditionalFiltersComponent,
    imports: [UnderConstructionModule, provideTranslocoTestingModule({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

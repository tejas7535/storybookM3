import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BearingSelectionFiltersSummaryComponent } from './bearing-selection-filters-summary.component';

describe('BearingSelectionFiltersSummaryComponent', () => {
  let component: BearingSelectionFiltersSummaryComponent;
  let spectator: Spectator<BearingSelectionFiltersSummaryComponent>;

  const createComponent = createComponentFactory({
    component: BearingSelectionFiltersSummaryComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

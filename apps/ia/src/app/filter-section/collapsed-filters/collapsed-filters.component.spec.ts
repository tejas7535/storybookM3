import { MatChipsModule } from '@angular/material/chips';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { CollapsedFiltersComponent } from './collapsed-filters.component';

describe('CollapsedFiltersComponent', () => {
  let component: CollapsedFiltersComponent;
  let spectator: Spectator<CollapsedFiltersComponent>;

  const createComponent = createComponentFactory({
    component: CollapsedFiltersComponent,
    imports: [provideTranslocoTestingModule({ en }), MatChipsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

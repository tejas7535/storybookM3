import { MatExpansionModule } from '@angular/material/expansion';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { FilterPanelComponent } from './filter-panel.component';

describe('FilterPanelComponent', () => {
  let spectator: Spectator<FilterPanelComponent>;
  let component: FilterPanelComponent;

  const createComponent = createComponentFactory({
    component: FilterPanelComponent,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({ en: {} }),
      MatExpansionModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

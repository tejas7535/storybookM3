import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DetailsTabComponent } from './details-tab.component';

describe('DetailsTabComponent', () => {
  let component: DetailsTabComponent;
  let spectator: Spectator<DetailsTabComponent>;

  const createComponent = createComponentFactory({
    component: DetailsTabComponent,
    imports: [provideTranslocoTestingModule({}), UnderConstructionModule],
    declarations: [DetailsTabComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

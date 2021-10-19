import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailsTabComponent } from './details-tab.component';
import { MaterialCardModule } from './material-card/material-card.module';

describe('DetailsTabComponent', () => {
  let component: DetailsTabComponent;
  let spectator: Spectator<DetailsTabComponent>;

  const createComponent = createComponentFactory({
    component: DetailsTabComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockModule(MaterialCardModule),
    ],
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

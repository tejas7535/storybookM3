import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BomTabComponent } from './bom-tab.component';

describe('BomTabComponent', () => {
  let component: BomTabComponent;
  let spectator: Spectator<BomTabComponent>;

  const createComponent = createComponentFactory({
    component: BomTabComponent,
    imports: [provideTranslocoTestingModule({}), UnderConstructionModule],
    declarations: [BomTabComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DrawingsTabComponent } from './drawings-tab.component';

describe('DrawingsTabComponent', () => {
  let spectator: Spectator<DrawingsTabComponent>;
  let component: DrawingsTabComponent;

  const createComponent = createComponentFactory({
    component: DrawingsTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

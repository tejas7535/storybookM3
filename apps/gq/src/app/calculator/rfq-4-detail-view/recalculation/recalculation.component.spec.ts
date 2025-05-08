import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RecalculationComponent } from './recalculation.component';

describe('RecalculationComponent', () => {
  let component: RecalculationComponent;
  let spectator: Spectator<RecalculationComponent>;

  const createComponent = createComponentFactory({
    component: RecalculationComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

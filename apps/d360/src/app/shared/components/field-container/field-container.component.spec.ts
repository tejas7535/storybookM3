import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FieldContainerComponent } from './field-container.component';

describe('FieldContainerComponent', () => {
  let spectator: Spectator<FieldContainerComponent>;

  const createComponent = createComponentFactory({
    component: FieldContainerComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});

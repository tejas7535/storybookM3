import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LabelValueComponent } from './label-value.component';

describe('LabelValueComponent', () => {
  let component: LabelValueComponent;
  let spectator: Spectator<LabelValueComponent>;

  const createComponent = createComponentFactory(LabelValueComponent);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

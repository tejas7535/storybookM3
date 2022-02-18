import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CompareLabelValueComponent } from './compare-label-value.component';

describe('CompareLabelValueComponent', () => {
  let component: CompareLabelValueComponent;
  let spectator: Spectator<CompareLabelValueComponent>;

  const createComponent = createComponentFactory(CompareLabelValueComponent);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

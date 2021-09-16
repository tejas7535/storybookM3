import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { LabelTextComponent } from './label-text.component';

describe('LabelTextComponent', () => {
  let component: LabelTextComponent;
  let spectator: Spectator<LabelTextComponent>;

  const createComponent = createComponentFactory({
    component: LabelTextComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.marginBottom).toBeTruthy();
  });
});

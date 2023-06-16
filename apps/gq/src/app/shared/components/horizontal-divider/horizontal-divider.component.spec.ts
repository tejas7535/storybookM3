import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HorizontalDividerComponent } from './horizontal-divider.component';

describe('HorizontalSeparatorComponent', () => {
  let component: HorizontalDividerComponent;
  let spectator: Spectator<HorizontalDividerComponent>;

  const createComponent = createComponentFactory({
    component: HorizontalDividerComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});

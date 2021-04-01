import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HorizontalSeparatorComponent } from './horizontal-separator.component';

describe('HorizontalSeparatorComponent', () => {
  let component: HorizontalSeparatorComponent;
  let spectator: Spectator<HorizontalSeparatorComponent>;

  const createComponent = createComponentFactory({
    component: HorizontalSeparatorComponent,
    declarations: [HorizontalSeparatorComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let spectator: Spectator<BadgeComponent>;

  const createComponent = createComponentFactory({
    component: BadgeComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        text: 'Test Badge',
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HorizontalSeparatorComponent } from './horizontal-separator.component';

describe('HorizontalSeparatorComponent', () => {
  let component: HorizontalSeparatorComponent;
  let spectator: Spectator<HorizontalSeparatorComponent>;

  const createComponent = createComponentFactory({
    component: HorizontalSeparatorComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        text: 'some description',
      },
    });

    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default text value', () => {
    expect(component.text()).toBe('some description');
  });

  it('should have default alwaysCentered value as false', () => {
    expect(component.alwaysCentered()).toBe(false);
  });
});

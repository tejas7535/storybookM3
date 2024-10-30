import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StyledSectionComponent } from './styled-section.component';

describe('StyledSectionComponent', () => {
  let spectator: Spectator<StyledSectionComponent>;

  const createComponent = createComponentFactory({
    component: StyledSectionComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set last property', () => {
    const newValue = true; // Ersetzen Sie dies durch den gewünschten Wert
    spectator.component.last = newValue;
    expect(spectator.component.last).toEqual(newValue);
  });

  it('should set grow property', () => {
    const newValue = false; // Ersetzen Sie dies durch den gewünschten Wert
    spectator.component.grow = newValue;
    expect(spectator.component.grow).toEqual(newValue);
  });

  it('should set fullHeight property', () => {
    const newValue = true; // Ersetzen Sie dies durch den gewünschten Wert
    spectator.component.fullHeight = newValue;
    expect(spectator.component.fullHeight).toEqual(newValue);
  });
});

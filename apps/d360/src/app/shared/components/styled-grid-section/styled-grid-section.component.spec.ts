import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { StyledGridSectionComponent } from './styled-grid-section.component';

describe('StyledGridSectionComponent', () => {
  let spectator: Spectator<StyledGridSectionComponent>;

  const createComponent = createComponentFactory({
    component: StyledGridSectionComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should set hidden property', () => {
    const newValue = true; // Replace with your desired value
    spectator.component.hidden = newValue;
    expect(spectator.component.hidden).toEqual(newValue);
  });

  it('should set smallHeight property', () => {
    const newValue = false; // Replace with your desired value
    spectator.component.smallHeight = newValue;
    expect(spectator.component.smallHeight).toEqual(newValue);
  });
});

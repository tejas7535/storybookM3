import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LubricationInputComponent } from './lubrication-input.component';

describe('LubricationInputComponent', () => {
  let spectator: Spectator<LubricationInputComponent>;

  const createComponent = createComponentFactory({
    component: LubricationInputComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('when inputs are provided', () => {
    beforeEach(() => {
      spectator.setInput('title', 'Test Title');
      spectator.setInput('value', 'Test Value');
    });

    it('should display the title', () => {
      expect(spectator.query('.text-low-emphasis')).toHaveText('Test Title');
    });

    it('should display the value', () => {
      expect(spectator.query('.text-medium-emphasis')).toHaveText('Test Value');
    });
  });
});

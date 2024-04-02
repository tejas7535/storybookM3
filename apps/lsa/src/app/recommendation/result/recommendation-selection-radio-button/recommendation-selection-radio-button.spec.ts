import { MatRadioButton } from '@angular/material/radio';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RecommendationSelectionRadioButtonComponent } from './recommendation-selection-radio-button';

describe('RecommendationSelectionRadioButtonComponent', () => {
  let component: RecommendationSelectionRadioButtonComponent;
  let spectator: Spectator<RecommendationSelectionRadioButtonComponent>;

  const createComponent = createComponentFactory({
    component: RecommendationSelectionRadioButtonComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when radio values are set', () => {
    beforeEach(() => {
      component.selected = true;
      component.title = 'radio button title';
      component.value = 'radio button value';
      spectator.detectChanges();
    });

    it('should contain radio button', () => {
      const radioButton: MatRadioButton = spectator.query(MatRadioButton);

      expect(radioButton).toBeTruthy();
      expect(radioButton.value).toBe('radio button value');
      expect(radioButton.checked).toBe(true);
    });

    it('should contain title', () => {
      const titleSpan = spectator.query('span');

      expect(titleSpan.textContent.trim()).toBe('radio button title');
    });
  });
});

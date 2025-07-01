import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { GeneralQuestionsTextAnalysisComponent } from './general-questions-text-analysis.component';

describe('GeneralQuestionsTextAnalysisComponent', () => {
  let component: GeneralQuestionsTextAnalysisComponent;
  let spectator: Spectator<GeneralQuestionsTextAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: GeneralQuestionsTextAnalysisComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isFullWidthRowRenderer', () => {
    it('should return true', () => {
      expect(component.isFullWidthRowRenderer()).toBeTruthy();
    });
  });
});

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { QualtricsSurveyComponent } from './qualtrics-survey.component';

describe('QualtricsSurveyComponent', () => {
  let component: QualtricsSurveyComponent;
  let spectator: Spectator<QualtricsSurveyComponent>;

  const createComponent = createComponentFactory({
    component: QualtricsSurveyComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide sanitized survey url', () => {
    expect(component.surveyUrl).toEqual({
      changingThisBreaksApplicationSecurity:
        'https://schaefflertech.qualtrics.com/jfe/form/SV_3wJxHoC3sDjvcCa',
    });
  });

  it('should provide url to the iFrame', () => {
    const iFrame: HTMLIFrameElement = spectator.query('iframe');

    expect(iFrame.src).toBe(
      'https://schaefflertech.qualtrics.com/jfe/form/SV_3wJxHoC3sDjvcCa'
    );
  });

  it('should provide closing icon', () => {
    expect(spectator.query('mat-icon')).toBeTruthy();
  });
});

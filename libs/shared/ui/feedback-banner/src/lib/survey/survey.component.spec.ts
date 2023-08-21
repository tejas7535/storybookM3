import { DIALOG_DATA } from '@angular/cdk/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SurveyComponent } from './survey.component';

describe('SurveyComponent', () => {
  let component: SurveyComponent;
  let spectator: Spectator<SurveyComponent>;

  const createComponent = createComponentFactory({
    component: SurveyComponent,
    providers: [
      {
        provide: DIALOG_DATA,
        useValue: {
          url: 'https://schaefflertech.qualtrics.com/jfe/form/someUrl?Q_Language=en',
        },
      },
    ],
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide sanitized survey url', () => {
    expect(component.safeSurveyUrl).toEqual({
      changingThisBreaksApplicationSecurity:
        'https://schaefflertech.qualtrics.com/jfe/form/someUrl?Q_Language=en',
    });
  });

  it('should provide url to the iFrame', () => {
    const iFrame: HTMLIFrameElement | null = spectator.query('iframe');

    expect(iFrame?.src).toBe(
      'https://schaefflertech.qualtrics.com/jfe/form/someUrl?Q_Language=en'
    );
  });

  it('should provide closing icon', () => {
    expect(spectator.query('mat-icon')).toBeTruthy();
  });
});

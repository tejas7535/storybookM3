import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QualtricsInfoBannerComponent } from './qualtrics-info-banner.component';

describe('QualtricsInfoBannerComponent', () => {
  let component: QualtricsInfoBannerComponent;
  let spectator: Spectator<QualtricsInfoBannerComponent>;

  const createComponent = createComponentFactory({
    component: QualtricsInfoBannerComponent,
    imports: [provideTranslocoTestingModule({ de: {} })],
    providers: [
      {
        provide: translate,
        useValue: jest.fn(),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when inputs are provided for FeedbackBannerComponent', () => {
    let feedbackBanner: FeedbackBannerComponent;

    beforeAll(() => {
      feedbackBanner = spectator.query(FeedbackBannerComponent);
    });

    it('should provide translated button text', () => {
      expect(feedbackBanner.feedbackButtonText).toBe(
        'qualtricsInfoBanner.feedbackButton'
      );
    });

    it('should provide translated info text', () => {
      expect(feedbackBanner.infoText).toBe('qualtricsInfoBanner.feedbackText');
    });

    it('should provide available languages', () => {
      expect(feedbackBanner.providedLanguages).toEqual([
        'de',
        'en',
        'es',
        'fr',
        'ru',
        'zh',
      ]);
    });

    it('should provide survey url', () => {
      expect(feedbackBanner.surveyUrl).toBe(
        'https://schaefflertech.qualtrics.com/jfe/form/SV_e5rEWZ7GrR1v0O2?Q_Language='
      );
    });
  });
});

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { translate, TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeedbackBannerComponent } from './feedback-banner.component';
import { InfoBannerComponent } from './info-banner/info-banner.component';

describe('FeedbackBannerComponent', () => {
  let component: FeedbackBannerComponent;
  let spectator: Spectator<FeedbackBannerComponent>;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: FeedbackBannerComponent,
    detectChanges: false,
    imports: [
      MatIconTestingModule,
      MockModule(MatDialogModule),
      MockModule(MatButtonModule),
      provideTranslocoTestingModule({ de: {} }),
    ],
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
    translocoService = spectator.inject(TranslocoService);
    component.providedLanguages = ['en', 'de'];
    component.feedbackButtonText = 'Share Feedback text';
    component.infoText = 'Your Feedback is important for Us.';

    spectator.detectChanges();
  });

  it('should display feedback button', () => {
    const button = spectator.query('button');

    expect(button).toBeTruthy();

    expect(button?.textContent).toContain('Share Feedback text');
  });

  it('should provide info text for info banner component', () => {
    const infoBanner: InfoBannerComponent | null =
      spectator.query(InfoBannerComponent);

    expect(infoBanner?.infoText).toBe('Your Feedback is important for Us.');
  });

  it('should open a dialog', () => {
    const spyDialogOpen = jest.spyOn(component['dialog'], 'open');

    spectator.component.openSurveyDialog();
    expect(spyDialogOpen).toHaveBeenCalled();
  });

  it('should set initial value for shouldDisplayBanner', () => {
    expect(component.shouldDisplayBanner).toBe(true);
  });

  describe('when selected language is not provided by qualtrics', () => {
    beforeEach(() => {
      component.shouldDisplayBanner = false;
      spectator.detectChanges();
    });

    it('should not display banner', () => {
      expect(spectator.query('ga-info-banner')).toBeNull();
    });
  });

  describe('when not provided by qualtrics language is selected', () => {
    test('add a subscribtion that listens to language changes and update flag to display view', (done) => {
      const mockLanguage = 'es';

      component.ngOnInit();

      translocoService.setActiveLang(mockLanguage);

      translocoService.langChanges$.subscribe(() => {
        expect(component.shouldDisplayBanner).toBe(false);

        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      const unsubscribeSpy = jest.spyOn(
        component['subscription'],
        'unsubscribe'
      );
      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});

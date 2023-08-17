import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoService } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QualtricsInfoBannerComponent } from './qualtrics-info-banner.component';

describe('QualtricsInfoBannerComponent', () => {
  let component: QualtricsInfoBannerComponent;
  let spectator: Spectator<QualtricsInfoBannerComponent>;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: QualtricsInfoBannerComponent,
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
    spectator.detectChanges();
  });

  it('should display feedback button', () => {
    const button = spectator.query('button');

    expect(button).toBeTruthy();

    expect(button.textContent).toContain('shared.feedbackButton');
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

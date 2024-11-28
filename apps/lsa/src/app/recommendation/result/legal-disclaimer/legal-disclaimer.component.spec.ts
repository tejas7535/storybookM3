import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LegalDisclaimerComponent } from './legal-disclaimer.component';

describe('LegalDisclaimerComponent', () => {
  let spectator: Spectator<LegalDisclaimerComponent>;
  const createComponent = createComponentFactory({
    component: LegalDisclaimerComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],

    detectChanges: false,
  });

  const disclaimerText =
    'Our details take into account those risks which were apparent to us on the basis of your requirements as made available to us. The results shown in the document have been worked out carefully and in accordance with the state of the art, but do not constitute an express or implied guaranty as to quality or durability in the legal sense. You are not dispensed thereby from checking the suitability of the products for your intended use. We shall be liable for the details provided in the recommendation only in the event of willful intent or negligence. In case of questions regarding the product, the recommendation or the suitability of the product, please';

  beforeEach(() => {
    spectator = createComponent();
    const translocoService = spectator.inject(TranslocoService);
    jest
      .spyOn(translocoService, 'selectTranslate')
      .mockReturnValue(of(disclaimerText));
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display short disclaimer initially', () => {
    spectator.detectChanges();
    expect(spectator.component.shortDisclaimer).toBe(
      `${disclaimerText.slice(0, 160)}...`
    );
  });

  it('should toggle disclaimer length', () => {
    spectator.detectChanges();
    spectator.component.toggleDisclaimerLength();
    spectator.detectChanges();
    expect(spectator.component.showFullText).toBe(true);
    expect(spectator.query('.disclaimer-block')).toHaveText(disclaimerText);
  });

  it('should display "Show More" initially', () => {
    spectator.detectChanges();

    expect(spectator.query('button')).toHaveText('disclaimer.showMore');
  });

  it('should display "Show Less" after toggling', () => {
    spectator.detectChanges();
    spectator.component.toggleDisclaimerLength();
    spectator.detectChanges();
    expect(spectator.query('button')).toHaveText('disclaimer.showLess');
  });
});

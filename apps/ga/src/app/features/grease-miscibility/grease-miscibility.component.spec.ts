import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';

import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';

import { GreaseCardComponent } from './grease-card/grease-card.component';
import { GreaseMiscibilityComponent } from './grease-miscibility.component';

class MockCalculationParametersFacade {
  selectedCompetitorGrease$ = of({ id: '1', name: 'Test Grease' });
  mixableSchaefflerGreases$ = of([
    { name: 'Arcanol X', id: '2' },
    { name: 'Arcanol Y', id: '3' },
  ]);
}

describe('GreaseMiscibilityComponent', () => {
  let spectator: Spectator<GreaseMiscibilityComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GreaseMiscibilityComponent,
    imports: [
      MatCardModule,
      MatIconModule,
      SubheaderModule,
      MockComponent(GreaseCardComponent),
      MockComponent(QualtricsInfoBannerComponent),
      MockComponent(QuickBearingSelectionComponent),
    ],
    providers: [
      {
        provide: CalculationParametersFacade,
        useClass: MockCalculationParametersFacade,
      },
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: of(false),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          langChanges$: of('en'),
          translate: jest.fn((key) => key),
          selectTranslate: jest.fn(() => of('')),
          getTranslation: jest.fn(() => of({})),
        },
      },
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    router = spectator.inject(Router) as any;
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should expose selectedCompetitorGrease signal', () => {
    expect(spectator.component.selectedCompetitorGrease()).toEqual({
      id: '1',
      name: 'Test Grease',
    });
  });

  it('should expose mixableSchaefflerGreases signal', () => {
    expect(spectator.component.mixableSchaefflerGreases()).toEqual([
      { name: 'Arcanol X', id: '2' },
      { name: 'Arcanol Y', id: '3' },
    ]);
  });

  it('should navigate back when navigateBack is called', () => {
    router.navigate = jest.fn();
    spectator.component.navigateBack();
    expect(router.navigate).toHaveBeenCalledWith([
      'grease-calculation/bearing',
    ]);
  });

  it('should expose currentLanguage signal', () => {
    expect(spectator.component.currentLanguage()).toBe('en');
  });

  it('should expose isPartnerVersion signal', () => {
    expect(spectator.component.isPartnerVersion()).toBe(false);
  });
});

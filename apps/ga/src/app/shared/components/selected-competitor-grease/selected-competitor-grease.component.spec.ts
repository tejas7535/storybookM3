import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { BehaviorSubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersFacade } from '@ga/core/store';

import { SelectedCompetitorGreaseComponent } from './selected-competitor-grease.component';

class MockCalculationParametersFacade {
  selectedCompetitorGreaseSubject = new BehaviorSubject({
    id: '1',
    name: 'Test Grease',
    company: 'Acme',
  });

  selectedCompetitorGrease$ =
    this.selectedCompetitorGreaseSubject.asObservable();
}

describe('SelectedCompetitorGreaseComponent', () => {
  let spectator: Spectator<SelectedCompetitorGreaseComponent>;

  const createComponent = createComponentFactory({
    component: SelectedCompetitorGreaseComponent,
    imports: [
      MatCardModule,
      MatIconModule,
      SharedTranslocoModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: CalculationParametersFacade,
        useClass: MockCalculationParametersFacade,
      },
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should expose selectedCompetitorGrease signal', () => {
    expect(spectator.component.selectedCompetitorGrease()).toEqual({
      id: '1',
      name: 'Test Grease',
      company: 'Acme',
    });
  });

  describe('competitorGreaseFullName', () => {
    let mockFacade: MockCalculationParametersFacade;

    beforeEach(() => {
      mockFacade = spectator.inject(
        CalculationParametersFacade
      ) as unknown as MockCalculationParametersFacade;
    });

    it('should concatenate company and name when company is not "Others"', () => {
      expect(spectator.component.competitorGreaseFullName()).toBe(
        'Acme Test Grease'
      );
    });

    it('should show only name when company is "Others"', () => {
      mockFacade.selectedCompetitorGreaseSubject.next({
        id: '1',
        name: 'Test Grease',
        company: 'Others',
      });

      expect(spectator.component.competitorGreaseFullName()).toBe(
        'Test Grease'
      );
    });

    it('should handle undefined grease gracefully', () => {
      mockFacade.selectedCompetitorGreaseSubject.next(undefined);

      expect(spectator.component.competitorGreaseFullName()).toBe(' ');
    });

    it('should handle missing company gracefully', () => {
      mockFacade.selectedCompetitorGreaseSubject.next({
        id: '1',
        name: 'Test Grease',
        company: '',
      });

      expect(spectator.component.competitorGreaseFullName()).toBe(
        ' Test Grease'
      );
    });

    it('should handle missing name gracefully', () => {
      mockFacade.selectedCompetitorGreaseSubject.next({
        id: '1',
        company: 'Acme',
        name: '',
      });

      expect(spectator.component.competitorGreaseFullName()).toBe('Acme ');
    });
  });
});

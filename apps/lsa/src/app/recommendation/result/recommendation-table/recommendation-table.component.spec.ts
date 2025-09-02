import { signal } from '@angular/core';

import { RestService } from '@lsa/core/services/rest.service';
import { RecommendationTableData } from '@lsa/shared/models';
import { Unitset } from '@lsa/shared/models/preferences.model';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RecommendationTableComponent } from './recommendation-table.component';

describe('RecommendationTableComponent', () => {
  let component: RecommendationTableComponent;
  let spectator: Spectator<RecommendationTableComponent>;

  const createComponent = createComponentFactory({
    component: RecommendationTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(RestService, {
        unitset: signal(Unitset.SI),
      }),
    ],
    detectChanges: false,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    const data = {
      headers: {},
      rows: [],
    } as RecommendationTableData;

    spectator.setInput('data', data);
  });

  it('should create', () => {
    spectator.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('get displayedColumns', () => {
    it('should return with minimum', () => {
      const headers = { minimum: {} };
      const expected = ['field', 'minimum'];

      const data = {
        headers,
        rows: [],
      } as RecommendationTableData;
      spectator.setInput('data', data);

      spectator.detectChanges();

      expect(component.displayedColumns).toEqual(expected);
    });

    it('should return with recommended', () => {
      const headers = { recommended: {} };
      const expected = ['field', 'recommended'];

      const data = {
        headers,
        rows: [],
      } as RecommendationTableData;
      spectator.setInput('data', data);

      spectator.detectChanges();

      expect(component.displayedColumns).toEqual(expected);
    });

    it('should return only fields', () => {
      const expected = ['field'];

      spectator.detectChanges();

      expect(component.displayedColumns).toEqual(expected);
    });
  });

  describe('isRecommended', () => {
    it('should be set to true if the result has a recommendation', () => {
      const data = {
        headers: { recommended: {} },
        rows: [],
      } as RecommendationTableData;

      spectator.setInput('data', data);
      expect(component.isRecommendedSelected()).toEqual(true);
    });

    it('should be false if no recommendation is available', () => {
      const data = {
        headers: { minimum: {} },
        rows: [],
      } as RecommendationTableData;
      spectator.setInput('data', data);
      expect(component.isRecommendedSelected()).toEqual(false);
    });
  });

  it('all changes to the isRecommendedSelected should trigger an event emission', () => {
    const outputSpy = jest.spyOn(
      component['recommendedSelectedChange'],
      'emit'
    );
    component['isRecommendedSelected'].set(true);
    spectator.detectChanges();
    expect(outputSpy).toHaveBeenCalledWith(true);
  });
});

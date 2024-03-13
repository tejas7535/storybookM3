import { RecommendationTableData } from '@lsa/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RecommendationTableComponent } from './recommendation-table.component';

describe('RecommendationTableComponent', () => {
  let component: RecommendationTableComponent;
  let spectator: Spectator<RecommendationTableComponent>;

  const createComponent = createComponentFactory({
    component: RecommendationTableComponent,
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

  describe('ngAfterViewInit', () => {
    it('should set isRecommendedSelected to true', () => {
      const data = {
        headers: { recommended: {} },
        rows: [],
      } as RecommendationTableData;
      spectator.setInput('data', data);
      component.isRecommendedSelected = false;

      component.ngAfterViewInit();

      expect(component.isRecommendedSelected).toEqual(true);
    });

    it('should set isRecommendedSelected to false', () => {
      const data = {
        headers: {},
        rows: [],
      } as RecommendationTableData;
      spectator.setInput('data', data);
      component.isRecommendedSelected = true;

      component.ngAfterViewInit();

      expect(component.isRecommendedSelected).toEqual(false);
    });
  });

  describe('onHeaderSelectionChange', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should set isRecommendedSelected and emit the event', () => {
      component.isRecommendedSelected = true;
      component.recommendedSelectedChange.emit = jest.fn();

      component.onHeaderSelectionChange({ isRecommended: false });

      expect(component.isRecommendedSelected).toEqual(false);
      expect(component.recommendedSelectedChange.emit).toHaveBeenCalledWith(
        false
      );
    });
  });
});

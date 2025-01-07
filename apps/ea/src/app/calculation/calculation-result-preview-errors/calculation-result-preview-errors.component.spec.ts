import { MatIconTestingModule } from '@angular/material/icon/testing';

import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultPreviewErrorsComponent } from './calculation-result-preview-errors.component';

describe('CalculationResultPreviewErrorsComponent', () => {
  let spectator: Spectator<CalculationResultPreviewErrorsComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewErrorsComponent,
    imports: [MatIconTestingModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: translate,
        useValue: jest.fn(),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  describe('data display', () => {
    describe('errors', () => {
      beforeEach(() => {
        spectator.setInput('overlayData', [
          {
            title: 'rating life',
            values: [{ unit: 'abc', title: 'abc', value: 1, isLoading: false }],
          },
          {
            title: 'emissions',
            values: [{ unit: 'abc', title: 'abc', value: 1, isLoading: false }],
          },
          {
            title: 'some other',
            values: [{ unit: 'abc', title: 'abc', value: 1, isLoading: false }],
          },
        ]);

        spectator.setInput('errors', ['error1', 'error2', 'error3']);
      });

      it('should combine errors', () => {
        spectator.detectChanges();
        expect(spectator.component.inlineErrors).toBe('error1 error2 error3');
      });

      it('should show titles', () => {
        spectator.detectChanges();
        expect(spectator.queryAll('.text-body-small').length).toBe(2);
      });
    });

    describe('downstreamErrors', () => {
      beforeEach(() => {
        spectator.setInput('overlayData', [
          {
            title: 'rating life',
            values: [{ unit: 'abc', title: 'abc', value: 1, isLoading: false }],
          },
          {
            title: 'emissions',
            values: [{ unit: 'abc', title: 'abc', value: 1, isLoading: false }],
          },
          {
            title: 'some other',
            values: [{ unit: 'abc', title: 'abc', value: 1, isLoading: false }],
          },
        ]);

        spectator.setInput('downstreamErrors', ['error1', 'error2', 'error3']);
      });

      it('should combine errors', () => {
        spectator.detectChanges();
        expect(spectator.component.inlineDownstreamErrors).toBe(
          'error1 error2 error3'
        );
      });

      it('should show titles', () => {
        spectator.detectChanges();
        expect(spectator.queryAll('.text-body-small').length).toBe(1);
      });
    });
  });

  describe('getAffectedItems', () => {
    it('should return catalog items', () => {
      spectator.component.inlineErrors = 'error';
      spectator.component.inlineDownstreamErrors = '';
      spectator.component.catalogCalculationData = [
        { title: 'rating life', values: [] },
      ];
      spectator.component.downstreamCalculationData = [
        { title: 'emissions', values: [] },
      ];

      spectator.detectChanges();

      const result = spectator.component.getAffectedItems();
      expect(result).toEqual([{ title: 'rating life', values: [] }]);
    });

    it('should return downstream items', () => {
      spectator.component.inlineErrors = '';
      spectator.component.inlineDownstreamErrors = 'error';
      spectator.component.catalogCalculationData = [
        { title: 'rating life', values: [] },
      ];
      spectator.component.downstreamCalculationData = [
        { title: 'emissions', values: [] },
      ];

      spectator.detectChanges();

      const result = spectator.component.getAffectedItems();
      expect(result).toEqual([{ title: 'emissions', values: [] }]);
    });

    it('should return both catalog and downstream items', () => {
      spectator.component.inlineErrors = 'error';
      spectator.component.inlineDownstreamErrors = 'error';
      spectator.component.catalogCalculationData = [
        { title: 'rating life', values: [] },
      ];
      spectator.component.downstreamCalculationData = [
        { title: 'emissions', values: [] },
      ];

      spectator.detectChanges();

      const result = spectator.component.getAffectedItems();
      expect(result).toEqual([
        { title: 'rating life', values: [] },
        { title: 'emissions', values: [] },
      ]);
    });
  });

  describe('toggleErrors', () => {
    it('should emit expandedChange', () => {
      const spy = jest.spyOn(spectator.component.expandedChange, 'emit');
      spectator.component.toggleErrors();
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});

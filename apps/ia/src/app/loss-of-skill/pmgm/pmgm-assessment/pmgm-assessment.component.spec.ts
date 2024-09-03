import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Color } from '../../../shared/models';
import { PmgmAssessment } from '../../models';
import { PmgmAssessmentComponent } from './pmgm-assessment.component';

describe('PmgmAssessmentComponent', () => {
  let component: PmgmAssessmentComponent;
  let spectator: Spectator<PmgmAssessmentComponent>;

  const createComponent = createComponentFactory({
    component: PmgmAssessmentComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [PmgmAssessmentComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set assessment', () => {
      component.agInit({ value: PmgmAssessment.GREEN } as ICellRendererParams);
      expect(component.assessment).toBe(PmgmAssessment.GREEN);
    });
  });

  describe('refresh', () => {
    test('should return false', () => {
      expect(component.refresh()).toBeFalsy();
    });
  });

  describe('defineColor', () => {
    test('should set color to red', () => {
      component.defineColor(PmgmAssessment.RED);
      expect(component.color.color).toBe(Color.RED);
      expect(component.tooltipPath).toBe('red');
      expect(component.showTooltip).toBeTruthy();
    });

    test('should set color to yellow', () => {
      component.defineColor(PmgmAssessment.YELLOW);
      expect(component.color.color).toBe(Color.YELLOW);
      expect(component.tooltipPath).toBe('yellow');
      expect(component.showTooltip).toBeTruthy();
    });

    test('should set color to green', () => {
      component.defineColor(PmgmAssessment.GREEN);
      expect(component.color.color).toBe(Color.GREEN);
      expect(component.showTooltip).toBeFalsy();
    });

    test('should set color to shadow grey', () => {
      component.defineColor(PmgmAssessment.GREY);
      expect(component.color.color).toBe(Color.SHADOW_GREY);
      expect(component.showTooltip).toBeFalsy();
    });

    test('should throw an error', () => {
      expect(() =>
        component.defineColor('INVALID_ASSESSMENT' as PmgmAssessment)
      ).toThrowError('Invalid assessment value');
    });
  });
});

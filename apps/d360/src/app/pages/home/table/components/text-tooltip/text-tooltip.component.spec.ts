import { ITooltipParams } from 'ag-grid-enterprise';

import { Stub } from './../../../../../shared/test/stub.class';
import { TextTooltipComponent } from './text-tooltip.component';

describe('TextTooltipComponent', () => {
  let component: TextTooltipComponent;

  beforeEach(() => {
    component = Stub.get({ component: TextTooltipComponent });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set params correctly', () => {
      const mockParams = {
        data: { portfolioStatus: 'IA' },
      } as ITooltipParams<{ [key: string]: string; portfolioStatus: string }>;

      component.agInit(mockParams);

      expect(component.params).toEqual(mockParams);
    });
  });

  describe('tooltipMessage', () => {
    it('should return correct tooltip text for IA status', () => {
      component.params = {
        data: { portfolioStatus: 'IA' },
      } as ITooltipParams<{ [key: string]: string; portfolioStatus: string }>;

      expect(component['tooltipMessage']).toBe(
        'material_customer.column.tooltipTextIA'
      );
    });

    it('should return correct tooltip text for SE status', () => {
      component.params = {
        data: { portfolioStatus: 'SE' },
      } as ITooltipParams<{ [key: string]: string; portfolioStatus: string }>;

      expect(component['tooltipMessage']).toBe(
        'material_customer.column.tooltipTextRE'
      );
    });

    it('should return correct tooltip text for SI status', () => {
      component.params = {
        data: { portfolioStatus: 'SI' },
      } as ITooltipParams<{ [key: string]: string; portfolioStatus: string }>;

      expect(component['tooltipMessage']).toBe(
        'material_customer.column.tooltipTextRE'
      );
    });

    it('should return empty string for any other status', () => {
      component.params = {
        data: { portfolioStatus: 'OTHER' },
      } as ITooltipParams<{ [key: string]: string; portfolioStatus: string }>;

      expect(component['tooltipMessage']).toBe('');
    });
  });
});

import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../test/stub.class';
import { ValueBadgeCellRendererComponent } from './value-badge-cell-renderer.component';

describe('ValueBadgeCellRendererComponent', () => {
  let component: ValueBadgeCellRendererComponent;

  beforeEach(() => {
    component = Stub.get({ component: ValueBadgeCellRendererComponent });
  });

  describe('setValue', () => {
    it('should set the value', () => {
      component['setValue']({ value: 100 } as ICellRendererParams);

      expect(component.value).toBe(100);
    });

    it('should show the colored background when the threshold is smaller than the value', () => {
      component['setValue']({
        value: 100,
        threshold: 50,
      } as ICellRendererParams & { threshold: number });

      expect(component['showColoredBackground']()).toBe(true);
    });

    it('should not show the colored background when the threshold is larger than the value', () => {
      component['setValue']({
        value: 50,
        threshold: 100,
      } as ICellRendererParams & { threshold: number });

      expect(component['showColoredBackground']()).toBe(false);
    });

    it('should show the colored background when the threshold is equal to the value', () => {
      component['setValue']({
        value: 50,
        threshold: 50,
      } as ICellRendererParams & { threshold: number });

      expect(component['showColoredBackground']()).toBe(true);
    });

    it('should not show the colored background when the threshold is not set', () => {
      component['setValue']({ value: 50 } as ICellRendererParams);

      expect(component['showColoredBackground']()).toBe(false);
    });

    it('should not show the colored background when the threshold is null', () => {
      component['setValue']({
        value: 50,
        threshold: null,
      } as ICellRendererParams & { threshold: number });

      expect(component['showColoredBackground']()).toBe(false);
    });

    it('should not show the colored background when the value is not set', () => {
      component['setValue']({} as ICellRendererParams & { threshold: number });

      expect(component['showColoredBackground']()).toBe(false);
    });

    it('should not show the colored background when only the threshold is not set', () => {
      component['setValue']({ threshold: 95 } as ICellRendererParams & {
        threshold: number;
      });

      expect(component['showColoredBackground']()).toBe(false);
    });

    it('should show the colored background when the rounded value equals the threshold', () => {
      component['setValue']({
        value: 94.8,
        threshold: 95,
      } as ICellRendererParams & {
        threshold: number;
      });

      expect(component['value']).toBe(95);
      expect(component['showColoredBackground']()).toBe(true);
    });

    it('should not show the colored background when the rounded value is smaller than the threshold', () => {
      component['setValue']({
        value: 94.2,
        threshold: 95,
      } as ICellRendererParams & {
        threshold: number;
      });

      expect(component['value']).toBe(94);
      expect(component['showColoredBackground']()).toBe(false);
    });

    it('should show the colored background when the rounded string value equals the threshold', () => {
      component['setValue']({
        value: '94.8',
        threshold: 95,
      } as ICellRendererParams & {
        threshold: number;
      });

      expect(component['value']).toBe(95);
      expect(component['showColoredBackground']()).toBe(true);
    });

    it('should not show the colored background when the rounded string value is smaller than the threshold', () => {
      component['setValue']({
        value: '94.2',
        threshold: 95,
      } as ICellRendererParams & {
        threshold: number;
      });

      expect(component['value']).toBe(94);
      expect(component['showColoredBackground']()).toBe(false);
    });
  });
});

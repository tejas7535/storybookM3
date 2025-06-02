import { QueryList } from '@angular/core';

import { Stub } from '../../test/stub.class';
import { HeaderActionBarComponent } from './header-action-bar.component';

describe('HeaderActionBarComponent', () => {
  let component: HeaderActionBarComponent;

  beforeEach(() => {
    component = Stub.getForEffect<HeaderActionBarComponent>({
      component: HeaderActionBarComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shouldRenderDivider', () => {
    it('should return false when no projected content exists', () => {
      component['projectedContent'] = undefined as any;
      expect(component['shouldRenderDivider']).toBe(false);
    });

    it('should return false when only one projected content exists', () => {
      component['projectedContent'] = { length: 1 } as QueryList<any>;
      expect(component['shouldRenderDivider']).toBe(false);
    });

    it('should return true when exactly two projected content exist', () => {
      component['projectedContent'] = [{}, {}] as any as QueryList<any>;
      expect(component['shouldRenderDivider']).toBe(true);
    });

    it('should return false when more than two projected content exist', () => {
      component['projectedContent'] = [{}, {}, {}] as any as QueryList<any>;
      expect(component['shouldRenderDivider']).toBe(false);
    });
  });

  describe('input properties', () => {
    it('should have wrapLeft set to false by default', () => {
      expect(component.wrapLeft()).toBe(false);
    });

    it('should have wrapRight set to false by default', () => {
      expect(component.wrapRight()).toBe(false);
    });

    it('should allow setting wrapLeft', () => {
      Stub.setInput('wrapLeft', true);
      expect(component.wrapLeft()).toBe(true);
    });

    it('should allow setting wrapRight', () => {
      Stub.setInput('wrapRight', true);
      expect(component.wrapRight()).toBe(true);
    });
  });
});

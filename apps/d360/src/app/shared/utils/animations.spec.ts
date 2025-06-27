import { AnimationTriggerMetadata } from '@angular/animations';

import { Animations } from './animations';

describe('Animations', () => {
  describe('flyInOut', () => {
    let animation: AnimationTriggerMetadata;

    beforeEach(() => {
      animation = Animations.flyInOut;
    });

    it('should create a trigger animation', () => {
      expect(animation.type).toBe(7); // 7 corresponds to AnimationTriggerMetadata
    });

    it('should have the correct name', () => {
      expect(animation.name).toBe('flyInOut');
    });

    it('should have the correct definitions', () => {
      expect(animation.definitions).toBeDefined();
      expect(animation.definitions.length).toBe(3); // 1 state + 2 transitions
    });
  });
});

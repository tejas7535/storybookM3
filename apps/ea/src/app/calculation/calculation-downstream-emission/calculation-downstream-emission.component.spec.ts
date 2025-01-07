import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationDownstreamEmissionComponent } from './calculation-downstream-emission.component';

describe('CalculationDownstreamEmissionComponent', () => {
  let spectator: Spectator<CalculationDownstreamEmissionComponent>;
  let component: CalculationDownstreamEmissionComponent;
  const createComponent = createComponentFactory({
    component: CalculationDownstreamEmissionComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when setting up emission', () => {
    beforeEach(() => {
      const co2_downstream = {
        emission: 123,
        emissionPercentage: 50,
        loadcases: [
          {
            id: 'Loadcase 1',
            emission: 0.49,
            unit: 'kg',
            emissionPercentage: 7.89,
            operatingTimeInHours: 150,
          },
          {
            id: 'Loadcase 2',
            emission: 0.51,
            unit: 'kg',
            emissionPercentage: 8.01,
            operatingTimeInHours: 250,
          },
        ],
      };
      spectator.setInput('selectedIndex', undefined);
      spectator.setInput('downstreamEmission', co2_downstream);
    });

    it('should set downstream emission', () => {
      expect(component.downstreamEmission).toMatchSnapshot();
    });

    it('should emit selectedIndexChange with the correct index', () => {
      const testIndex = 1;
      jest.spyOn(component.selectedIndexChange, 'emit');

      component.selectItem(testIndex);

      expect(component.selectedIndexChange.emit).toHaveBeenCalledWith(
        testIndex
      );
    });

    describe('when swiping loadcases list', () => {
      it('should handle touch start', () => {
        const touchEvent = new TouchEvent('touchstart', {
          changedTouches: [
            {
              identifier: 0,
              target: window,
              screenX: 100,
              screenY: 0,
            } as unknown as Touch,
          ],
        });

        component.onTouchStart(touchEvent);
        expect(component['touchStartX']).toBe(100);
      });

      it('should handle touch move', () => {
        const touchEvent = new TouchEvent('touchmove', {
          changedTouches: [
            {
              identifier: 0,
              target: window,
              screenX: 150,
              screenY: 0,
            } as unknown as Touch,
          ],
        });

        component.onTouchMove(touchEvent);
        expect(component['touchEndX']).toBe(150);
      });

      it('should handle touch end and swipe left', () => {
        component['touchStartX'] = 100;
        component['touchEndX'] = 50;

        jest.spyOn(component, 'nextItem');
        jest.spyOn(component, 'previousItem');

        component.onTouchEnd();

        expect(component.nextItem).toHaveBeenCalled();
        expect(component.previousItem).not.toHaveBeenCalled();
      });

      it('should handle touch end and swipe right', () => {
        component['touchStartX'] = 50;
        component['touchEndX'] = 100;

        jest.spyOn(component, 'nextItem');
        jest.spyOn(component, 'previousItem');

        component.onTouchEnd();

        expect(component.previousItem).toHaveBeenCalled();
        expect(component.nextItem).not.toHaveBeenCalled();
      });

      it('should not trigger swipe if distance is less than threshold', () => {
        component['touchStartX'] = 100;
        component['touchEndX'] = 120;

        jest.spyOn(component, 'nextItem');
        jest.spyOn(component, 'previousItem');

        component.onTouchEnd();

        expect(component.nextItem).not.toHaveBeenCalled();
        expect(component.previousItem).not.toHaveBeenCalled();
      });

      it('should return correct swipe params for left direction', () => {
        component.swipeDirection = 'left';
        const result = component.getSwipeParams();
        expect(result).toEqual({
          value: '',
          params: {
            enterTransform: 'translateX(100%)',
            leaveTransform: 'translateX(-100%)',
          },
        });
      });

      it('should return correct swipe params for right direction', () => {
        component.swipeDirection = 'right';
        const result = component.getSwipeParams();
        expect(result).toEqual({
          value: '',
          params: {
            enterTransform: 'translateX(-100%)',
            leaveTransform: 'translateX(100%)',
          },
        });
      });
    });

    it('should emit previous index', () => {
      component.selectedIndex = 1;
      jest.spyOn(component.selectedIndexChange, 'emit');

      component.previousItem();

      expect(component.selectedIndexChange.emit).toHaveBeenCalledWith(0);
    });

    it('should emit zero if already at first index', () => {
      component.selectedIndex = 0;
      jest.spyOn(component.selectedIndexChange, 'emit');

      component.previousItem();

      expect(component.selectedIndexChange.emit).toHaveBeenCalledWith(0);
    });

    it('should emit next index', () => {
      component.selectedIndex = 1;
      jest.spyOn(component.selectedIndexChange, 'emit');

      component.nextItem();

      expect(component.selectedIndexChange.emit).toHaveBeenCalledWith(2);
    });

    it('should not emit if already at last index', () => {
      component.selectedIndex = 3;

      jest.spyOn(component.selectedIndexChange, 'emit');

      component.nextItem();

      expect(component.selectedIndexChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('when there is not emission', () => {
    beforeEach(() => {
      const co2_downstream = {
        emission: 0,
        emissionPercentage: 0,
      };

      spectator.setInput('selectedIndex', undefined);
      spectator.setInput('downstreamEmission', co2_downstream);
    });

    it('should handle it gracefully', () => {
      expect(component.downstreamEmission).toMatchSnapshot();
    });
  });

  it('should add event listeners on ngOnInit', () => {
    const addEventListenerSpy = jest.spyOn(
      component['el'].nativeElement,
      'addEventListener'
    );

    component.ngOnInit();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function),
      { passive: true }
    );
  });

  it('should remove event listeners on ngOnDestroy', () => {
    const removeEventListenerSpy = jest.spyOn(
      component['el'].nativeElement,
      'removeEventListener'
    );

    component.ngOnDestroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function)
    );
  });
});

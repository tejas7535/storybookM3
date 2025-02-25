import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockDirective } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReportCo2EmissionsValuesComponent } from '../report-co2-emissions-values/report-co2-emissions-values.component';
import { CalculationDownstreamEmissionComponent } from './calculation-downstream-emission.component';
import { CalculationDowstreamSwipeDirective } from './calculation-downstream-swipe.directive';

describe('CalculationDownstreamEmissionComponent', () => {
  let spectator: Spectator<CalculationDownstreamEmissionComponent>;
  let component: CalculationDownstreamEmissionComponent;
  const createComponent = createComponentFactory({
    component: CalculationDownstreamEmissionComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockDirective(CalculationDowstreamSwipeDirective),
      MockComponent(ReportCo2EmissionsValuesComponent),
    ],
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
      it('should handle left swap', () => {
        const swipeElement = spectator.debugElement.query(
          By.directive(CalculationDowstreamSwipeDirective)
        );
        jest.spyOn(component, 'nextItem');
        jest.spyOn(component, 'previousItem');

        swipeElement.triggerEventHandler('swipeLeft', undefined);

        expect(component.previousItem).toHaveBeenCalled();
        expect(component.nextItem).not.toHaveBeenCalled();
      });

      it('should handle right swap', () => {
        const swipeElement = spectator.debugElement.query(
          By.directive(CalculationDowstreamSwipeDirective)
        );
        jest.spyOn(component, 'nextItem');
        jest.spyOn(component, 'previousItem');

        swipeElement.triggerEventHandler('swipeRight', undefined);

        expect(component.previousItem).not.toHaveBeenCalled();
        expect(component.nextItem).toHaveBeenCalled();
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
});

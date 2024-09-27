import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReportSelectionComponent } from './report-selection.component';

describe('ReportSelectionComponent', () => {
  let spectator: Spectator<ReportSelectionComponent>;
  let component: ReportSelectionComponent;

  const createComponent = createComponentFactory({
    component: ReportSelectionComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when calculation type was clicked', () => {
    beforeEach(() => {
      component['calculationTypeClicked'].emit = jest.fn();
    });

    it('should emit button pressed event', () => {
      component.onCalculationTypeClicked('mountingInstructions');

      expect(component['calculationTypeClicked'].emit).toBeCalledWith(
        'mountingInstructions'
      );
    });
  });
});

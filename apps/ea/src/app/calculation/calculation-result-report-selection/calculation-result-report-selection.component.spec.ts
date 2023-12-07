import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultReportSelectionComponent } from './calculation-result-report-selection.component';

describe('CalculationResultReportSelectionComponent', () => {
  let component: CalculationResultReportSelectionComponent;
  let spectator: Spectator<CalculationResultReportSelectionComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultReportSelectionComponent,
    imports: [
      MockModule(MatDividerModule),

      MatIconTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();

    component = spectator.debugElement.componentInstance;
    component.isDownloadButtonHidden = true;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when download button was pressed', () => {
    beforeEach(() => {
      component['downloadClicked'].emit = jest.fn();
    });

    it('should emit button pressed event', () => {
      component.onDownloadAction();

      expect(component['downloadClicked'].emit).toBeCalledWith();
    });
  });

  describe('when calculation type was clicked', () => {
    beforeEach(() => {
      component['calculationTypeClicked'].emit = jest.fn();
    });

    it('should emit button pressed event', () => {
      component.onCalculationTypeClicked('ratingLife');

      expect(component['calculationTypeClicked'].emit).toBeCalledWith(
        'ratingLife'
      );
    });
  });
});

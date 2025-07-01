import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReasonAnalysisComponent } from './reason-analysis.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((arg) => arg),
}));
describe('ReasonAnalysisComponent', () => {
  let component: ReasonAnalysisComponent;
  let spectator: Spectator<ReasonAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: ReasonAnalysisComponent,
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('createButtonLabel', () => {
    test('should return the correct label when expanded is true', () => {
      component.expanded = true;

      expect(component.createButtonLabel()).toEqual(
        'reasonsAndCounterMeasures.reasonsForLeaving.table.analysis.button.seeLess'
      );
    });

    test('should return the correct label when expanded is false', () => {
      component.expanded = false;

      expect(component.createButtonLabel()).toEqual(
        'reasonsAndCounterMeasures.reasonsForLeaving.table.analysis.button.seeMore'
      );
    });
  });
});

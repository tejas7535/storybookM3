import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AttritionDialogLineChartComponent } from './attrition-dialog-line-chart.component';

describe('AttritionDialogLineChartComponent', () => {
  let component: AttritionDialogLineChartComponent;
  let spectator: Spectator<AttritionDialogLineChartComponent>;

  const createComponent = createComponentFactory({
    component: AttritionDialogLineChartComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set current year', () => {
      const current = new Date().getFullYear();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.currentYear).toEqual(current);
    });
  });
});

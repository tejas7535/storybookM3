import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { AddAnalysisComponent } from './add-analysis.component';

describe('AddAnalysisComponent', () => {
  let component: AddAnalysisComponent;
  let spectator: Spectator<AddAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: AddAnalysisComponent,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openDialog', () => {
    test('should open dialog', () => {
      global.console = {
        log: jest.fn(),
      } as unknown as Console;

      component.openDialog();
      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalled();
    });
  });
});

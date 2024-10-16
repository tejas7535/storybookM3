import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LubricationInputsComponent } from './lubrication-inputs.component';

describe('LubricationInputsComponent', () => {
  let spectator: Spectator<LubricationInputsComponent>;

  const createComponent = createComponentFactory({
    component: LubricationInputsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        inputs: {
          sections: [
            { title: 'Section 1', stepIndex: 0, inputs: [] },
            { title: 'Section 2', stepIndex: 1, inputs: [] },
            { title: 'Section 3', stepIndex: 2, inputs: [] },
          ],
        },
      },
    });
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the sections', () => {
    const sections = spectator.queryAll('.text-on-surface-variant p');

    expect(sections).toHaveLength(3);
    expect(sections[0]).toHaveText('Section 1');
    expect(sections[1]).toHaveText('Section 2');
    expect(sections[2]).toHaveText('Section 3');
  });

  it('should call navigate with correct stepIndex on button click and emit change', () => {
    const navigateSpy = jest.spyOn(spectator.component, 'navigate');
    const navigateToStepSpy = jest.spyOn(
      spectator.component['navigateToStep'],
      'emit'
    );
    const button = spectator.query('button[aria-label="Edit"]');

    spectator.click(button);

    expect(navigateSpy).toHaveBeenCalledWith(0);
    expect(navigateToStepSpy).toHaveBeenCalledWith(0);
  });
});

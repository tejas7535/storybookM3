import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { CONCEPT1_LABEL_VALUE_MOCK } from '@ga/testing/mocks';

import { AutomaticLubricationPipe } from './automatic-lubrication.pipe';

describe('AutomaticLubricationPipe', () => {
  let spectator: SpectatorPipe<AutomaticLubricationPipe>;

  const createPipe = createPipeFactory({
    pipe: AutomaticLubricationPipe,
  });

  it('should keep concept1 row if activated', () => {
    spectator = createPipe(
      `{{ mockLabelValues | automaticLubrication: mockLubrication | json }}`,
      {
        hostProps: {
          mockLabelValues: CONCEPT1_LABEL_VALUE_MOCK,
          mockLubrication: true,
        },
      }
    );

    expect(JSON.parse(spectator.element.textContent)).toHaveLength(2);
    expect(JSON.parse(spectator.element.textContent)).toStrictEqual(
      CONCEPT1_LABEL_VALUE_MOCK
    );
  });

  it('should keep remove concept1 row if deactivated', () => {
    spectator = createPipe(
      `{{ mockLabelValues | automaticLubrication: mockLubrication | json }}`,
      {
        hostProps: {
          mockLabelValues: CONCEPT1_LABEL_VALUE_MOCK,
          mockLubrication: false,
        },
      }
    );

    const expectedResult = CONCEPT1_LABEL_VALUE_MOCK.splice(0, 1); // remove concept1 row to compare

    expect(JSON.parse(spectator.element.textContent)).toHaveLength(1);
    expect(JSON.parse(spectator.element.textContent)).toStrictEqual(
      expectedResult
    );
  });
});

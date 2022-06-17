import { PreferredGreaseOption } from '@ga/shared/models';
import {
  DIALOG_RESPONSE_LIST_VALUE_MOCK,
  PREFERRED_GREASE_OPTION_MOCK,
} from '@ga/testing/mocks';

import { adaptPreferredGreaseOptionsFromDialogResponseListValues } from './grease-helpers';

describe('Grease helpers', () => {
  describe('adaptPreferredGreaseOptionsFromDialogResponseListValues', () => {
    it('should convert dialog response list values into options for preferred grease', () => {
      expect(
        adaptPreferredGreaseOptionsFromDialogResponseListValues([
          DIALOG_RESPONSE_LIST_VALUE_MOCK,
        ])
      ).toStrictEqual([PREFERRED_GREASE_OPTION_MOCK]);
    });

    it('should handle invalid or incomplete data', () => {
      const emptyData =
        adaptPreferredGreaseOptionsFromDialogResponseListValues();
      const invalidData =
        adaptPreferredGreaseOptionsFromDialogResponseListValues([undefined]);
      const resultFromInvalidData: PreferredGreaseOption[] = [
        {
          id: undefined,
          text: undefined,
        },
      ];

      expect(emptyData).toStrictEqual([]);
      expect(invalidData).toStrictEqual(resultFromInvalidData);
    });
  });
});

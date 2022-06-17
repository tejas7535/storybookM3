import { PreferredGrease, PreferredGreaseOption } from '@ga/shared/models';

export const PREFERRED_GREASE_OPTION_MOCK: PreferredGreaseOption = {
  id: 'mock_id',
  text: 'mock_string',
};

export const PREFERRED_GREASE_MOCK: PreferredGrease = {
  loading: false,
  greaseOptions: [PREFERRED_GREASE_OPTION_MOCK],
  selectedGrease: PREFERRED_GREASE_OPTION_MOCK,
};

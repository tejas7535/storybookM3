import {
  DialogResponse,
  DialogResponseGroup,
  DialogResponseListValue,
  DialogResponseMember,
  DialogResponsePage,
  DialogResponsePageVisibility,
} from '@ga/shared/models';

export const DIALOG_RESPONSE_LIST_VALUE_MOCK: DialogResponseListValue = {
  id: 'mock_id',
  text: 'mock_string',
  imageUrl: 'mock_url',
};

export const DIALOG_RESPONSE_MEMBER_MOCK: DialogResponseMember = {
  id: 'mock_id',
  text: 'mock_text',
  type: 'mock_type',
  listValues: [DIALOG_RESPONSE_LIST_VALUE_MOCK],
  defaultValue: 'mock_url',
};

export const DIALOG_RESPONSE_GROUP_MOCK: DialogResponseGroup = {
  isIteratorGroup: false,
  members: [DIALOG_RESPONSE_MEMBER_MOCK, DIALOG_RESPONSE_MEMBER_MOCK],
};

export const DIALOG_RESPONSE_PAGE_VISIBILITY_MOCK: DialogResponsePageVisibility =
  {
    value: true,
  };

export const DIALOG_RESPONSE_PAGE_MOCK: DialogResponsePage = {
  id: 'mock_id',
  title: 'mock_title',
  text: 'mock_text',
  visible: DIALOG_RESPONSE_PAGE_VISIBILITY_MOCK,
  groups: [DIALOG_RESPONSE_GROUP_MOCK],
  subPages: [],
};

export const DIALOG_RESPONSE_MOCK: DialogResponse = {
  pages: [
    DIALOG_RESPONSE_PAGE_MOCK,
    DIALOG_RESPONSE_PAGE_MOCK,
    DIALOG_RESPONSE_PAGE_MOCK,
  ],
};

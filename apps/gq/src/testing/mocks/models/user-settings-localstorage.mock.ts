import { UserSettingsKeys } from '@gq/shared/services/rest/user-settings/models/user-settings-keys.enum';

export const USER_SETTINGS_LOCALSTORAGE_MOCK = {
  [UserSettingsKeys.LANGUAGE]: 'en',
  [UserSettingsKeys.LOCALE]: 'en-US',
  [UserSettingsKeys.GQ_CASE_OVERVIEW_STATE]: '{"case-overview-state":true}',
  [UserSettingsKeys.GQ_PROCESS_CASE_STATE]: '{"process-case-state":true}',
  [UserSettingsKeys.GQ_REFERENCE_PRICING_TABLE_STATE]:
    '{"reference-pricing-table-state":true}',
  [UserSettingsKeys.GQ_SAP_PRICE_DETAILS_STATE]:
    '{"sap-price-details-state":true}',
  [UserSettingsKeys.GQ_TRANSACTIONS_STATE]: '{"transactions-state":true}',
  [UserSettingsKeys.GQ_SEARCH_MATERIAL_RESULTS_TABLE_STATE]:
    '{"materialResults":false}',
  [UserSettingsKeys.GQ_SEARCH_CASES_RESULTS_TABLE_STATE]:
    '{"casesResults":false}',
};

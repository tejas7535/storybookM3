import 'jest-preset-angular/setup-jest';

import { LicenseManager } from 'ag-grid-enterprise';

// eslint-disable-next-line import/order
global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `Using_this_{AG_Grid}_Enterprise_key_{AG-068056}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Schaeffler_Technologies_AG_&_Co._KG}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Data_Science_Solutions}_only_for_{16}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_{Data_Science_Solutions}_need_to_be_licensed___{Data_Science_Solutions}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{2_November_2025}____[v3]_[01]_MTc2MjA0MTYwMDAwMA==90817029a626fd310e58ecd38ec534de`
  );
});

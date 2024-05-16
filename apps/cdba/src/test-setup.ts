// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../global-mocks';
import 'jest-canvas-mock';
import 'jest-preset-angular/setup-jest';

import { TranslocoModule } from '@jsverse/transloco';
import { LicenseManager } from 'ag-grid-enterprise';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `Using_this_AG_Grid_Enterprise_key_( AG-045886 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( Schaeffler Technologies AG & Co. KG )_is_granted_a_( Multiple Applications )_Developer_License_for_( 8 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_AG_Grid_Enterprise___This_key_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 28 August 2024 )____[v2]_MTcyNDc5OTYwMDAwMA==80fd7d0000935fba2a7639b3f6169e76`
  );
});

import { LicenseManager } from 'ag-grid-enterprise';

/**
 * Set agGrid license key (this is public by design)
 */
export function setupGridLicense() {
  LicenseManager.setLicenseKey(
    `Using_this_AG_Grid_Enterprise_key_( AG-046385 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( Schaeffler Technologies AG & Co. KG )_is_granted_a_( Single Application )_Developer_License_for_the_application_( Schaeffler Demand360 )_only_for_( 3 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_( Schaeffler Demand360 )_need_to_be_licensed___( Schaeffler Demand360 )_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 31 October 2024 )____[v2]_MTczMDMzMjgwMDAwMA==1ef82902464a69b4fde0a430071e447f`
  );
}

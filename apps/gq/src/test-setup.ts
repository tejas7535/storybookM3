// tslint:disable ordered-imports
import { LicenseManager } from '@ag-grid-enterprise/all-modules';

import '../../../global-mocks';
import 'jest-preset-angular/setup-jest';

global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `CompanyName=Comparex AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedApplication=angular,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=9,LicensedProductionInstancesCount=0,AssetReference=AG-011662,ExpiryDate=5_November_2021_[v2]_MTYzNjA3MDQwMDAwMA==685d64a76556dd1ffc78a59025dc6b39`
  );
});

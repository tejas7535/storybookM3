/* tslint:disable:ordered-imports */
import '../../../global-mocks';
import 'jest-preset-angular';

import { LicenseManager } from '@ag-grid-enterprise/all-modules';

global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `CompanyName=Comparex AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedApplication=angular,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-007753,ExpiryDate=16_April_2021_[v2]_MTYxODUyNzYwMDAwMA==5afc7856a0a523ad5e5ad2c4376519f6`
  );
});

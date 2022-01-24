import 'jest-preset-angular/setup-jest';

import { LicenseManager } from '@ag-grid-enterprise/all-modules';

// eslint-disable-next-line import/order
global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `CompanyName=SoftwareOne AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedGroup=Data Science Solutions,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=1,AssetReference=AG-022173,ExpiryDate=14_January_2023_[v2]_MTY3MzY1NDQwMDAwMA==c393351117eb419cc1aec4eed573b05e`
  );
});

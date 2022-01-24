import '../../../global-mocks';
import 'jest-canvas-mock';
import 'jest-preset-angular/setup-jest';

import { LicenseManager } from '@ag-grid-enterprise/core';
import { TranslocoModule } from '@ngneat/transloco';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));

global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `CompanyName=SoftwareOne AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedGroup=Data Science Solutions,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=1,AssetReference=AG-022173,ExpiryDate=14_January_2023_[v2]_MTY3MzY1NDQwMDAwMA==c393351117eb419cc1aec4eed573b05e`
  );
});

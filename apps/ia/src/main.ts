import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { LicenseManager } from '@ag-grid-enterprise/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey(
  `CompanyName=SoftwareOne AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedGroup=Data Science Solutions,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=5,LicensedProductionInstancesCount=1,AssetReference=AG-022173,ExpiryDate=14_January_2023_[v2]_MTY3MzY1NDQwMDAwMA==c393351117eb419cc1aec4eed573b05e`
);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((error) => console.error(error));

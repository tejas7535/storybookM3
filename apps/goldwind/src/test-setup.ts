/* eslint-disable import/order */
import '../../../global-mocks';
import 'jest-canvas-mock';
import 'jest-preset-angular/setup-jest';

import { LicenseManager } from '@ag-grid-enterprise/all-modules';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

defineGlobalsInjections({
  imports: [provideTranslocoTestingModule({ en: {} }), ReactiveComponentModule],
});

global.beforeEach(() => {
  LicenseManager.setLicenseKey(
    `CompanyName=Comparex AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedApplication=angular,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=9,LicensedProductionInstancesCount=0,AssetReference=AG-011662,ExpiryDate=5_November_2021_[v2]_MTYzNjA3MDQwMDAwMA==685d64a76556dd1ffc78a59025dc6b39`
  );
});

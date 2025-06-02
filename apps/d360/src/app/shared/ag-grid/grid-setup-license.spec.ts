import { LicenseManager } from 'ag-grid-enterprise';

import { setupGridLicense } from './grid-setup-license';

describe('setupGridLicense', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set the license key using LicenseManager', () => {
    jest.spyOn(LicenseManager, 'setLicenseKey').mockImplementation(() => {});

    setupGridLicense();

    expect(LicenseManager.setLicenseKey).toHaveBeenCalledTimes(1);
  });
});

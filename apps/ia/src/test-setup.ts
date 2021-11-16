/* eslint-disable import/order */
import { LicenseManager } from '@ag-grid-enterprise/core';
import { TranslocoModule } from '@ngneat/transloco';

import '../../../global-mocks';
import 'jest-canvas-mock';
import 'jest-preset-angular/setup-jest';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

const orgChartMock: any = {
  container: jest.fn(() => orgChartMock),
  data: jest.fn(() => orgChartMock),
  backgroundColor: jest.fn(() => orgChartMock),
  svgWidth: jest.fn(() => orgChartMock),
  svgHeight: jest.fn(() => orgChartMock),
  initialZoom: jest.fn(() => orgChartMock),
  nodeWidth: jest.fn(() => orgChartMock),
  nodeHeight: jest.fn(() => orgChartMock),
  compact: jest.fn(() => orgChartMock),
  nodeContent: jest.fn(() => orgChartMock),
  buttonContent: jest.fn(() => orgChartMock),
  linkUpdate: jest.fn(() => orgChartMock),
  render: jest.fn(() => orgChartMock),
  fit: jest.fn(),
};

jest.mock('d3-org-chart', () => ({
  OrgChart: jest.fn().mockImplementation(() => orgChartMock),
}));

global.beforeAll(() => {
  LicenseManager.setLicenseKey(
    `CompanyName=Comparex AG (Leipzig)_on_behalf_of_Schaeffler Technologies AG & Co,LicensedApplication=angular,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=9,LicensedProductionInstancesCount=0,AssetReference=AG-011662,ExpiryDate=5_November_2021_[v2]_MTYzNjA3MDQwMDAwMA==685d64a76556dd1ffc78a59025dc6b39`
  );
});

/* eslint-disable import/order */
import '../../../global-mocks';
import 'jest-preset-angular/setup-jest';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

const orgChartMock: any = {
  container: jest.fn(() => orgChartMock),
  data: jest.fn(() => orgChartMock),
  backgroundColor: jest.fn(() => orgChartMock),
  svgWidth: jest.fn(() => orgChartMock),
  svgHeight: jest.fn(() => orgChartMock),
  initialZoom: jest.fn(() => orgChartMock),
  marginTop: jest.fn(() => orgChartMock),
  render: jest.fn(() => orgChartMock),
};

jest.mock('d3-org-chart', () => {
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  return jest.fn().mockImplementation(() => {
    return orgChartMock;
  });
});

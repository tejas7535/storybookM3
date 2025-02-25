import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { sharedTranslocoLocaleConfig } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReportCo2EmissionsValuesComponent } from './report-co2-emissions-values.component';

jest.mock(
  '@ea/core/services/assets-path-resolver/assets-path-resolver.helper',
  () => ({
    getAssetsPath: jest.fn(() => 'mockAssetsPath'),
  })
);

describe('ReportCo2EmissionsValuesComponent', () => {
  let spectator: Spectator<ReportCo2EmissionsValuesComponent>;
  const createComponent = createComponentFactory({
    component: ReportCo2EmissionsValuesComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideTranslocoLocale(sharedTranslocoLocaleConfig),
      MeaningfulRoundPipe,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should bind co2Emission input', () => {
    spectator.setInput('co2Emission', 100);
    expect(spectator.component.co2Emission).toBe(100);
  });

  it('should bind co2EmissionPercentage input', () => {
    spectator.setInput('co2EmissionPercentage', 50);
    expect(spectator.component.co2EmissionPercentage).toBe(50);
  });

  it('should bind operatingHours input', () => {
    spectator.setInput('operatingHours', 2000);
    expect(spectator.component.operatingHours).toBe(2000);
  });

  it('should handle undefined operatingHours input', () => {
    spectator.setInput('operatingHours', undefined);
    expect(spectator.component.operatingHours).toBeUndefined();
  });

  it('should combine the image with the assetsPath', () => {
    expect(spectator.component.getImagePath('test')).toEqual(
      'mockAssetsPath/images/test'
    );
  });
});

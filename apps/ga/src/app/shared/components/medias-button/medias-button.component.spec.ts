import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MEDIASBEARING } from '@ga/features/grease-calculation/calculation-result/constants';
import { PartnerAfiliateCode, PartnerVersion } from '@ga/shared/models';

import { MediasButtonComponent } from './medias-button.component';

describe('MediasButtonComponent', () => {
  let component: MediasButtonComponent;
  let spectator: Spectator<MediasButtonComponent>;

  const createComponent = createComponentFactory({
    component: MediasButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getBearingShopUrl', () => {
    it('should return a shop url', () => {
      component.bearing = 'mockbearing';

      expect(component.getBearingShopUrl()).toBe(
        'calculationResult.shopBaseUrl/p/mockbearing?utm_source=grease-app'
      );
    });

    describe('when partner version affiliate code available', () => {
      it('should include code in the url', () => {
        const partnerVersion = PartnerVersion.Schmeckthal;
        const affiliateCode = PartnerAfiliateCode[partnerVersion];

        component.bearing = 'mockbearing';
        component.partnerVersion = partnerVersion;

        expect(component.getBearingShopUrl()).toBe(
          `calculationResult.shopBaseUrl/p/mockbearing?utm_source=grease-app&${affiliateCode}`
        );
      });
    });
  });

  describe('bearingInMedias', () => {
    it('should return true when its in the list', () => {
      component.bearing = '6226';

      expect(component.checkBearingInMedias()).toBeTruthy();
    });

    it('should return a shop url', () => {
      component.bearing = '6226-madeup';

      expect(component.checkBearingInMedias()).toBeFalsy();
    });
  });

  describe('#trackBearingSelection', () => {
    it('should call the logEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      const mockBearing = 'Hyperbearing';
      component.bearing = mockBearing;

      component.trackBearingSelection();

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASBEARING, {
        bearing: mockBearing,
      });
    });
  });
});

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { greaseResultMock } from '@ga/testing/mocks';

import { MEDIASGREASE } from '../../constants';
import { GreaseReportResultComponent } from './grease-report-result.component';

window.ResizeObserver = resize_observer_polyfill;

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('GreaseReportResultComponent', () => {
  let component: GreaseReportResultComponent;
  let spectator: Spectator<GreaseReportResultComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportResultComponent,
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
      PushModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component.greaseResult = {
      ...greaseResultMock,
      dataSource: [...greaseResultMock.dataSource, undefined],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should assign data', () => {
      component.ngOnInit();

      expect(component.labelValues).toHaveLength(3);
    });
  });

  describe('getShopUrl', () => {
    it('should return a valid url', () => {
      expect(component.getShopUrl()).toBe(
        'calculationResult.shopBaseUrl/search/searchpage?text=Arcanol MULTI2'
      );
    });
  });

  describe('toggleShowValues', () => {
    it('should switch data amount', () => {
      component.toggleShowValues();
      expect(component.labelValues).toHaveLength(18);

      component.toggleShowValues();
      expect(component.labelValues).toHaveLength(3);
    });
  });

  describe('#trackGreaseSelection', () => {
    it('should call the logEvent method', () => {
      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackGreaseSelection();

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: 'Arcanol MULTI2',
      });
    });
  });
});

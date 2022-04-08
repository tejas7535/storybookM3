import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { greaseResultMock } from '../../../mocks/grease-result.mock';
import { MEDIASGREASE } from '../../models/index';
import { GreaseResultComponent } from './grease-result.component';

window.ResizeObserver = resize_observer_polyfill;

describe('GreaseResultComponent', () => {
  let component: GreaseResultComponent;
  let spectator: Spectator<GreaseResultComponent>;

  const createComponent = createComponentFactory({
    component: GreaseResultComponent,
    declarations: [GreaseResultComponent],
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
      ReactiveComponentModule,
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
      const mockGrease = 'RESI SCHMELZ';

      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackGreaseSelection(mockGrease);

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: mockGrease,
      });
    });
  });
});

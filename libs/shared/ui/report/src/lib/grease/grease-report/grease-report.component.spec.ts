import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { Observable } from 'rxjs';

import { formattedGreaseJson } from '../../../mocks/index';
import { Subordinate, TitleId } from '../../models/index';
import { GreaseReportInputComponent } from '../grease-report-input/grease-report-input.component';
import { GreaseReportService } from '../services/grease-report.service';
import { GreaseReportComponent } from './grease-report.component';

describe('GreaseReportComponent', () => {
  let component: GreaseReportComponent;
  let spectator: Spectator<GreaseReportComponent>;
  let snackBar: MatSnackBar;
  const localizeNumber = jest.fn();
  const localeChanges$ = new Observable();

  const createComponent = createComponentFactory({
    component: GreaseReportComponent,
    declarations: [GreaseReportComponent, GreaseReportInputComponent],
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),

      MatExpansionModule,
      MatSnackBarModule,
    ],
    providers: [
      mockProvider(GreaseReportService),
      mockProvider(TranslocoLocaleService, { localizeNumber, localeChanges$ }),
    ],
  });

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      }),
    });
    spectator = createComponent();
    component = spectator.component;

    snackBar = spectator.inject(MatSnackBar);
    component.greaseReportTitle = 'mockTitle';
    snackBar.open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getJsonReport if jsonReport is set', () => {
      component.greaseReportUrl = 'jup';
      component['fetchGreaseReport'] = jest.fn();

      component.ngOnInit();

      expect(component['fetchGreaseReport']).toHaveBeenCalledTimes(1);
    });
    it('should do nothing if jsonReport and htmlReport are not set', () => {
      component['fetchGreaseReport'] = jest.fn();

      component.ngOnInit();

      expect(component['fetchGreaseReport']).not.toHaveBeenCalled();
    });
  });

  describe('showSnackBarError', () => {
    it('should open the snackbar', () => {
      component.showSnackBarError();
      expect(snackBar.open).toBeCalledTimes(1);
    });
  });

  describe('isGreaseResultSection', () => {
    it('should return true if the titleID is the result titleID', () => {
      const result = component.isGreaseResultSection(
        TitleId.STRING_OUTP_RESULTS
      );

      expect(result).toBeTruthy();
    });

    it('should return false if the titleID is not the result titleID', () => {
      const result = component.isGreaseResultSection(TitleId.STRING_OUTP_INPUT);

      expect(result).toBeFalsy();
    });
  });

  describe('toggleLimitResults', () => {
    it('should toggle the limitResults component var', () => {
      component.limitResults = false;

      component.toggleLimitResults();

      expect(component.limitResults).toBeTruthy();
    });
  });

  describe('limitSubordinates', () => {
    it('should limit the subordinate to the amount of limitResults', () => {
      component.limitResults = true;
      const mockLength = 2;
      component.resultAmount = mockLength;

      const result = component.limitSubordinates(
        formattedGreaseJson[1].subordinates as Subordinate[],
        TitleId.STRING_OUTP_RESULTS
      );

      expect(result).toHaveLength(mockLength);
    });

    it('should not limit the subordinate to the amount of limitResults', () => {
      component.limitResults = false;
      component.resultAmount = 2;

      const result = component.limitSubordinates(
        formattedGreaseJson[1].subordinates as Subordinate[],
        TitleId.STRING_OUTP_RESULTS
      );

      expect(result).toHaveLength(3);
    });
  });

  describe('getResultAmount', () => {
    it('should set the length of allResultAmount', () => {
      const getResultAmountSpy = jest.spyOn(
        component['greaseReportService'],
        'getResultAmount'
      );
      component.subordinates = formattedGreaseJson;

      component.getResultAmount();

      expect(getResultAmountSpy).toHaveBeenCalledTimes(1);
    });
  });
});

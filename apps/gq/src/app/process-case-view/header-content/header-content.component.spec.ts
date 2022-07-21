import { DatePipe } from '@angular/common';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_MOCK } from '../../../testing/mocks/models/quotation.mock';
import { InfoIconModule } from '../../shared/components/info-icon/info-icon.module';
import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { Keyboard } from '../../shared/models';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { HeaderContentComponent } from './header-content.component';

describe('HeaderContentComponent', () => {
  let component: HeaderContentComponent;
  let spectator: Spectator<HeaderContentComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;
  let fakeTranslocoService: SpyObject<TranslocoService>;

  const createComponent = createComponentFactory({
    component: HeaderContentComponent,
    imports: [
      MatIconModule,
      InfoIconModule,
      SharedPipesModule,
      PushModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
    fakeTranslocoService = spectator.inject(TranslocoService);
    fakeTranslocoService.selectTranslate = jest
      .fn()
      .mockReturnValue(of('translated')) as any;
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('case editing modal', () => {
    beforeEach(() => {
      component.updateQuotation.emit = jest.fn();
    });
    test('should pass caseName to Modal', () => {
      component.caseName = 'case-name';

      component.openCaseEditingModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditCaseModalComponent,
        {
          width: '480px',
          data: {
            caseName: 'case-name',
          },
        }
      );
    });

    test('should emit output for caseName and currency', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ caseName: 'test', currency: 'EUR' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(1);
      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        caseName: 'test',
        currency: 'EUR',
      });
    });
    test('should emit output for caseName', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ caseName: 'test' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(1);
      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        caseName: 'test',
      });
    });
    test('should emit output for currency', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ currency: 'EUR' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(1);
      expect(component.updateQuotation.emit).toHaveBeenCalledWith({
        currency: 'EUR',
      });
    });

    test('should not emit output', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of()),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(0);
    });
    test('should not emit output on same caseName', () => {
      component.caseName = 'caseName';
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ caseName: 'caseName' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(0);
    });
    test('should not emit output on same currency', () => {
      component.currency = 'EUR';
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ currency: 'EUR' })),
      });

      component.openCaseEditingModal();

      expect(component.updateQuotation.emit).toHaveBeenCalledTimes(0);
    });
  });

  describe('quotation input', () => {
    test(
      'translations for quotation mock',
      marbles((m) => {
        spectator.setInput('quotation', QUOTATION_MOCK);
        const datePipe = new DatePipe('en');
        const transformFormat = 'dd.MM.yyyy HH:mm';

        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledTimes(2);
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.gqHeader',
          {
            gqCreationDate: datePipe.transform(
              QUOTATION_MOCK.gqCreated,
              transformFormat
            ),
            gqCreationName: QUOTATION_MOCK.gqCreatedByUser.name,
            gqUpdatedDate: datePipe.transform(
              QUOTATION_MOCK.gqLastUpdated,
              transformFormat
            ),
            gqUpdatedName: QUOTATION_MOCK.gqLastUpdatedByUser.name,
          },
          'process-case-view'
        );
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.sapHeader',
          {
            sapCreationName: QUOTATION_MOCK.sapCreatedByUser.name,
            sapCreationDate: datePipe.transform(
              QUOTATION_MOCK.sapCreated,
              transformFormat
            ),
            sapUpdatedDate: datePipe.transform(
              QUOTATION_MOCK.sapLastUpdated,
              transformFormat
            ),
          },
          'process-case-view'
        );
        m.expect(component.gqHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
        m.expect(component.sapHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
      })
    );
    test(
      'translations for missing sap updated date',
      marbles((m) => {
        spectator.setInput('quotation', {
          ...QUOTATION_MOCK,
          sapLastUpdated: undefined,
        });
        const datePipe = new DatePipe('en');
        const transformFormat = 'dd.MM.yyyy HH:mm';

        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledTimes(2);
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.gqHeader',
          {
            gqCreationDate: datePipe.transform(
              QUOTATION_MOCK.gqCreated,
              transformFormat
            ),
            gqCreationName: QUOTATION_MOCK.gqCreatedByUser.name,
            gqUpdatedDate: datePipe.transform(
              QUOTATION_MOCK.gqLastUpdated,
              transformFormat
            ),
            gqUpdatedName: QUOTATION_MOCK.gqLastUpdatedByUser.name,
          },
          'process-case-view'
        );
        expect(fakeTranslocoService.selectTranslate).toHaveBeenCalledWith(
          'header.sapHeader',
          {
            sapCreationName: QUOTATION_MOCK.sapCreatedByUser.name,
            sapCreationDate: datePipe.transform(
              QUOTATION_MOCK.sapCreated,
              transformFormat
            ),
            sapUpdatedDate: Keyboard.DASH,
          },
          'process-case-view'
        );
        m.expect(component.gqHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
        m.expect(component.sapHeader$).toBeObservable('(a|)', {
          a: 'translated',
        });
      })
    );
  });
});

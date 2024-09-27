import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { QuotationMetadataService } from '@gq/shared/services/rest/quotation/quotation-metadata/quotation-metadata.service';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { QUOTATION_MOCK } from '../../../../../testing/mocks';
import { QUOTATION_METADATA_MOCK } from '../../../../../testing/mocks/models/quotation-metadata.mock';
import { getGqId } from '../active-case.selectors';
import { QuotationMetadataActions } from './quotation-metadata.action';
import { QuotationMetadataEffects } from './quotation-metadata.effects';

describe('QuotationMetadataEffects', () => {
  let spectator: SpectatorService<QuotationMetadataEffects>;
  let actions$: any;
  let action: any;
  let effects: QuotationMetadataEffects;
  let quotationMetadataService: QuotationMetadataService;
  let store: MockStore;
  let snackBar: MatSnackBar;
  let translocoService: TranslocoService;

  const createService = createServiceFactory({
    service: QuotationMetadataEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      { provide: TranslocoService, useValue: { translate: jest.fn() } },
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(QuotationMetadataEffects);
    quotationMetadataService = spectator.inject(QuotationMetadataService);
    store = spectator.inject(MockStore);
    snackBar = spectator.inject(MatSnackBar);
    translocoService = spectator.inject(TranslocoService);
  });
  describe('updateQuotationMetadata$', () => {
    test(
      'should return updateQuotationMetadataSuccess when REST call is successful',
      marbles((m) => {
        snackBar.open = jest.fn();

        action = QuotationMetadataActions.updateQuotationMetadata({
          quotationMetadata: QUOTATION_METADATA_MOCK,
        });
        quotationMetadataService.updateQuotationMetadata = jest.fn(
          () => response
        );
        store.overrideSelector(getGqId, 123);
        const result = QuotationMetadataActions.updateQuotationMetadataSuccess({
          quotation: QUOTATION_MOCK,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: QUOTATION_MOCK });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updateQuotationMetadata$).toBeObservable(expected);
        m.flush();
        expect(
          quotationMetadataService.updateQuotationMetadata
        ).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(translocoService.translate).toHaveBeenCalledWith(
          'header.noteModal.snackBarMessages.noteSaved',
          {},
          'process-case-view'
        );
      })
    );

    test(
      'should return updateQuotationMetaDataFailure when REST call fails',
      marbles((m) => {
        snackBar.open = jest.fn();

        const errorMessage = 'An error occurred';
        action = QuotationMetadataActions.updateQuotationMetadata({
          quotationMetadata: QUOTATION_METADATA_MOCK,
        });
        actions$ = m.hot('-a', { a: action });

        store.overrideSelector(getGqId, 123);
        const result = QuotationMetadataActions.updateQuotationMetadataFailure({
          errorMessage,
        });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        quotationMetadataService.updateQuotationMetadata = jest.fn(
          () => response
        );

        m.expect(effects.updateQuotationMetadata$).toBeObservable(expected);
        m.flush();
        expect(
          quotationMetadataService.updateQuotationMetadata
        ).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(translocoService.translate).toHaveBeenCalledWith(
          'header.noteModal.snackBarMessages.error',
          {},
          'process-case-view'
        );
      })
    );
  });
});

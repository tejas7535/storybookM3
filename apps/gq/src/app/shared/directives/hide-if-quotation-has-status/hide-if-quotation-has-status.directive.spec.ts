import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { QUOTATION_MOCK } from '../../../../testing/mocks';
import { getQuotation } from '../../../core/store';
import { QuotationStatus } from '../../models';
import { HideIfQuotationHasStatusDirective } from './hide-if-quotation-has-status.directive';

describe('HideIfQuotationHasStatusDirective', () => {
  let spectator: SpectatorDirective<HideIfQuotationHasStatusDirective>;
  let directive: HideIfQuotationHasStatusDirective;
  let store: MockStore;

  const createDirective = createDirectiveFactory({
    directive: HideIfQuotationHasStatusDirective,
    providers: [provideMockStore()],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div *hideIfQuotationHasStatus="[${QuotationStatus.DELETED}, ${QuotationStatus.INACTIVE}]"></div>`
    );
    store = spectator.inject(MockStore);
    directive = spectator.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should create view if quotation does not have a forbidden status', () => {
    jest.spyOn(directive['viewContainer'], 'createEmbeddedView');

    store.overrideSelector(getQuotation, {
      ...QUOTATION_MOCK,
      status: QuotationStatus.ACTIVE,
    });

    spectator.detectChanges();

    expect(directive['viewContainer'].createEmbeddedView).toHaveBeenCalled();
  });

  test('should clear view if quotation has a forbidden status', () => {
    jest.spyOn(directive['viewContainer'], 'clear');

    store.overrideSelector(getQuotation, {
      ...QUOTATION_MOCK,
      status: QuotationStatus.INACTIVE,
    });

    spectator.detectChanges();

    expect(directive['viewContainer'].clear).toHaveBeenCalled();
  });
});

import { getQuotationStatus } from '@gq/core/store/active-case/active-case.selectors';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

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

    store.overrideSelector(getQuotationStatus, QuotationStatus.ACTIVE);

    spectator.detectChanges();

    expect(directive['viewContainer'].createEmbeddedView).toHaveBeenCalled();
  });

  test('should clear view if quotation has a forbidden status', () => {
    jest.spyOn(directive['viewContainer'], 'clear');

    store.overrideSelector(getQuotationStatus, QuotationStatus.INACTIVE);

    spectator.detectChanges();

    expect(directive['viewContainer'].clear).toHaveBeenCalled();
  });

  test('should create if quotation status has changed', () => {
    jest.spyOn(directive['viewContainer'], 'createEmbeddedView');
    jest.spyOn(directive['viewContainer'], 'clear');

    // First render: quotation status is ACTIVE
    store.overrideSelector(getQuotationStatus, QuotationStatus.ACTIVE);
    spectator.detectChanges();

    // Quotation was updated: quotation status has changed
    store.resetSelectors();
    store.overrideSelector(getQuotationStatus, QuotationStatus.INACTIVE);
    store.refreshState();

    // Both createEmbeddedView and clear should have been called once
    expect(directive['viewContainer'].createEmbeddedView).toHaveBeenCalledTimes(
      1
    );
    expect(directive['viewContainer'].clear).toHaveBeenCalledTimes(1);
  });

  test('should NOT create again if quotation status has NOT changed', () => {
    jest.spyOn(directive['viewContainer'], 'createEmbeddedView');
    jest.spyOn(directive['viewContainer'], 'clear');

    // First render: quotation status is ACTIVE
    store.overrideSelector(getQuotationStatus, QuotationStatus.ACTIVE);
    spectator.detectChanges();

    // Quotation was updated: quotation status has NOT changed
    store.refreshState();

    // createEmbeddedView should have been called only once
    expect(directive['viewContainer'].createEmbeddedView).toHaveBeenCalledTimes(
      1
    );
    expect(directive['viewContainer'].clear).not.toHaveBeenCalled();
  });
});

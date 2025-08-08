import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GreasePDFSelectionService } from './grease-pdf-select.service';

describe('GreasePDFSelectionService', () => {
  let service: GreasePDFSelectionService;
  let spectator: SpectatorService<GreasePDFSelectionService>;

  const createService = createServiceFactory({
    service: GreasePDFSelectionService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('toggleSelected', () => {
    it('should add a non existing grease', () => {
      service.toggleSelected('ARCANOL MULTI2');
      expect(service.isSelected('ARCANOL MULTI2')).toEqual(true);
    });

    it('should remove an already existing grease', () => {
      service['_selectionMode'].set(true);
      const testGrease = 'ARCANOL MULTI2';
      service['_selectedSet'].set(new Set([testGrease]));
      expect(service['_selectedSet']().size).toEqual(1);

      service.toggleSelected(testGrease);

      expect(service.isSelected(testGrease)).toEqual(false);
    });
  });

  describe('toggleSelection', () => {
    it('toggleSelection should update the selection mode', () => {
      expect(service['_selectionMode']()).toEqual(false);

      service.toggleSelectionMode();

      expect(service['_selectionMode']()).toEqual(true);
    });

    it('toggling selection off should call out to reset()', () => {
      service.toggleSelectionMode();
      const spy = jest.spyOn(service, 'reset');
      service.toggleSelectionMode();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('selectionCount should reflect the number of selected items', () => {
    service['_selectedSet'].set(
      new Set(['ARCANOL 1', 'ARCANOL 2', 'ARCANOL 3'])
    );
    expect(service['selectedCount']()).toEqual(3);
  });

  describe('setSelectionMode', () => {
    it('setting should update the value', () => {
      service.setSelectionMode(true);
      expect(service.selectionMode()).toEqual(true);
    });

    it('when setting to false, reset should be called', () => {
      const spy = jest.spyOn(service, 'reset');
      service.setSelectionMode(false);
      expect(spy).toHaveBeenCalled();
    });
  });
});

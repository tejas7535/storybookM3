import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';

import { MMLocales } from './locale.enum';
import { LocaleService } from './locale.service';
import { MMSeparator } from './separator.enum';

const availableLangs: AvailableLangs = [];
describe('LocaleService', () => {
  let spectator: SpectatorService<LocaleService>;
  let service: LocaleService;
  let translocoService: TranslocoService;

  const createService = createServiceFactory({
    service: LocaleService,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          getActiveLang: jest.fn(() => 'de'),
          getAvailableLangs: jest.fn(() => availableLangs),
          setActiveLang: jest.fn(() => {}),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(LocaleService);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(translocoService.setActiveLang).toHaveBeenCalledWith('de');
  });

  it('should set the seperator', () => {
    service['separator'].next = jest.fn();

    service.setSeparator(MMSeparator.Point);

    expect(service['separator'].next).toHaveBeenCalledWith(MMSeparator.Point);
    expect(service['manualSeparator']).toBe(true);
  });

  it('should set locale and switch separator', () => {
    service['separator'].next = jest.fn();

    service.setLocale(MMLocales.en);

    expect(translocoService.setActiveLang).toHaveBeenCalledWith('en');
    expect(service['separator'].next).toHaveBeenCalledWith(MMSeparator.Point);
  });

  it('should set locale and not switch separator if manual separator is true', () => {
    service['separator'].next = jest.fn();
    service['manualSeparator'] = true;

    service.setLocale(MMLocales.en);

    expect(translocoService.setActiveLang).toHaveBeenCalledWith('en');
    expect(service['separator'].next).not.toHaveBeenCalled();
  });

  it('should return available langs', () => {
    const result = service.getAvailableLangs();

    expect(result).toEqual(availableLangs);
    expect(translocoService.getAvailableLangs).toHaveBeenCalled();
  });
});

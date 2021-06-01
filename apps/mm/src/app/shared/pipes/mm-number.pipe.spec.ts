import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';

import { BehaviorSubject } from 'rxjs';

import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { LocaleService } from '../../core/services/locale/locale.service';
import { MMSeparator } from '../../core/services/locale/separator.enum';
import { MmNumberPipe } from './mm-number.pipe';

describe('MmNumberPipe', () => {
  let spectator: SpectatorPipe<MmNumberPipe>;
  const separator: BehaviorSubject<MMSeparator> =
    new BehaviorSubject<MMSeparator>(MMSeparator.Comma);
  let decimalPipe: DecimalPipe;

  const createPipe = createPipeFactory({
    pipe: MmNumberPipe,
    providers: [
      DecimalPipe,
      {
        provide: LocaleService,
        useValue: {
          separator$: separator.asObservable(),
        },
      },
    ],
  });

  beforeEach(() => {
    registerLocaleData(localeDe, 'de');
    registerLocaleData(localeEn, 'en');
  });

  it('should transform numbers with correct separator', () => {
    spectator = createPipe(`{{ 10000000.123 | mmNumber }}`);
    decimalPipe = spectator.inject(DecimalPipe);
    jest.spyOn(decimalPipe, 'transform');
    expect(spectator.element.textContent).toBe('10.000.000,123');
    separator.next(MMSeparator.Point);
    spectator.detectChanges();
    expect(spectator.element.textContent).toBe('10,000,000.123');
    expect(decimalPipe.transform).toHaveBeenCalled();
  });

  it('should use cached value on calls with same parameters', () => {
    spectator = createPipe();
    decimalPipe = spectator.inject(DecimalPipe);
    const localeService = spectator.inject(LocaleService);
    const pipe = new MmNumberPipe(decimalPipe, localeService);
    jest.spyOn(decimalPipe, 'transform');

    const params = {
      value: 1,
      separator: MMSeparator.Point,
      digitsInfo: '',
      locale: 'en',
    };

    pipe['previousParams'] = params;
    pipe['cache'] = 'The cached value';

    const result = pipe.transform(
      params.value,
      params.digitsInfo,
      params.locale
    );

    expect(pipe['separator']).toEqual(MMSeparator.Point);
    expect(pipe['previousParams']).toEqual(params);

    expect(result).toBe('The cached value');
    expect(decimalPipe.transform).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    spectator = createPipe();
    decimalPipe = spectator.inject(DecimalPipe);
    const localeService = spectator.inject(LocaleService);
    const pipe = new MmNumberPipe(decimalPipe, localeService);
    pipe['subscription'].unsubscribe = jest.fn();

    pipe.ngOnDestroy();

    expect(pipe['subscription'].unsubscribe).toHaveBeenCalled();
  });
});

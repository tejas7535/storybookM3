/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import {
  catchError,
  debounceTime,
  map,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  DialogState,
  EABackendVerificationResponse,
  ErrorState,
  ReportMetadata,
  ScannedState,
} from './scan.models';

const EA_BACKEND_BASE_URL = 'https://engineeringapps-d.dev.dp.schaeffler';
// const EA_BACKEND_BASE_URL = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class ScanService {
  private readonly detection$ = new Subject<string>();
  public readonly codeCheck$ = this.detection$.pipe(
    debounceTime(2000),
    map((barcode) => this.checkAuthenticity(barcode)),
    switchMap((httpObservable) => httpObservable)
  );

  private readonly modalState: WritableSignal<DialogState> = signal({
    name: 'Intro',
  });

  private readonly error$ = new Subject<Error | string>();
  readonly state: Signal<DialogState> = this.modalState.asReadonly();
  readonly reportUrl: Signal<string | undefined> = computed(() =>
    this.state().name === 'Error' || this.state().name === 'Scanned'
      ? this.getReportMailUrl()
      : undefined
  );
  readonly designation: Signal<string | undefined> = computed(() =>
    this.state().name === 'Scanned'
      ? (this.state() as ScannedState).pimData.bearingxDesignation
      : undefined
  );
  readonly errorState: Signal<ErrorState> = this.state as Signal<ErrorState>;
  readonly stateData: Signal<Omit<DialogState, 'name'>> = computed(() =>
    this.state()
  );

  constructor(
    private readonly httpClient: HttpClient,
    private readonly translocoService: TranslocoService
  ) {
    this.error$.subscribe((err) => {
      let errState: ErrorState;
      if (typeof err === 'object') {
        errState = {
          name: 'Error',
          title: 'Unkown error occured',
          description:
            'An unknown error occured. Please check you have a camera connected to your device and security settings set up propeprly',
        };
      } else if (typeof err === 'string') {
        errState = {
          name: 'Error',
          title: err,
          description: this.translocoService.translate(
            `origincheck.errors.${err}`
          ),
        };
      }
      this.modalState.set(errState as ErrorState);
    });

    this.codeCheck$.subscribe((response) => {
      const newState: ScannedState = {
        name: 'Scanned',
        codeValue: response.pim,
        productCode: response.pim,
        codeFlag: response.flag,
        message: response.upstreamMessages,
        greaseAppSupport: response.greaseAppSupport,
        pimData:
          response.flag === 'RED'
            ? undefined
            : {
                imageUrl: response.imageUrl,
                bearingxDesignation: response.bearinxDesignation,
              },
      };
      this.modalState.set(newState);
    });
  }

  public setBarcode(result: string) {
    this.modalState.set({ name: 'Loading' });
    this.detection$.next(result);
  }

  public enableScanner() {
    this.modalState.set({ name: 'Scanner' });
  }

  public pushError(error: Error | string) {
    this.error$.next(error);
  }

  public reset() {
    this.modalState.set({ name: 'Intro' });
  }

  checkAuthenticity(
    bearingCode: string
  ): Observable<EABackendVerificationResponse> {
    return this.httpClient
      .post<EABackendVerificationResponse>(`${EA_BACKEND_BASE_URL}/verify`, {
        bearingCode: btoa(bearingCode),
        language: this.translocoService.getActiveLang(),
      })
      .pipe(
        catchError((err, _caught) => {
          if (err.error.detail.code) {
            this.error$.next(err.error.detail.code);
          }

          return of();
        })
      );
  }

  private getReportMailUrl(): string {
    const subject = this.translocoService.translate(
      'origincheck.report.subjectLine'
    );
    const receiverEmail = this.translocoService.translate(
      'origincheck.report.receiverAddress'
    );
    const reportMetadata: ReportMetadata[] = [
      {
        translationKey: 'reason',
        value:
          this.modalState().name === 'Error'
            ? 'Invalid Format'
            : 'Origin Check Result',
      },
    ];

    if (this.modalState().name === 'Error') {
      reportMetadata.push({
        translationKey: 'error',
        value: (this.modalState() as ErrorState).description,
      });
    } else {
      reportMetadata.push(
        {
          translationKey: 'codeState',
          value: (this.modalState() as ScannedState).codeFlag,
        },
        {
          translationKey: 'message',
          value: (this.modalState() as ScannedState).message || 'None',
        }
      );
    }
    const reportMetaBody = reportMetadata
      .map((meta) => {
        const translated = this.translocoService.translate(
          `origincheck.report.${meta.translationKey}`
        );

        return `${translated}: ${meta.value}`;
      })
      .join('%0A');

    const body = [
      ...this.translocoService.translate('origincheck.report.mailBody'),
      reportMetaBody,
    ].join('%0A');

    return `mailto:${receiverEmail}?subject=${subject}&body=${body}`;
  }
}

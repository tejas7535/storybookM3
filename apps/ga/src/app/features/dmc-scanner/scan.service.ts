/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import {
  computed,
  effect,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import {
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  timeout,
} from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { GoogleBarcodeScannerModuleInstallState } from '@capacitor-mlkit/barcode-scanning';
import { TranslocoService } from '@jsverse/transloco';

import { environment } from '@ga/environments/environment';

import { BarcodeScannerFacade } from './barcode-scanner.facade';
import {
  DialogState,
  EABackendVerificationResponse,
  ErrorState,
  ReportMetadata,
  ScannedState,
} from './scan.models';

const EA_BACKEND_BASE_URL = environment.dmcBackendUrl;
const DO_NOT_SHOW_STORAGE_KEY = 'camera-prompt-donotshow';

const initialState: DialogState = {
  name: 'Intro',
  native: Capacitor.isNativePlatform(),
} as const;

@Injectable({ providedIn: 'root' })
export class ScanService {
  private readonly detection$ = new Subject<string>();
  public readonly codeCheck$ = this.detection$.pipe(
    debounceTime(2000),
    map((barcode) => this.checkAuthenticity(barcode)),
    switchMap((httpObservable) => httpObservable)
  );

  private readonly modalState: WritableSignal<DialogState> =
    signal(initialState);
  readonly androidDownloadEffect = effect(() => {
    const state = this.modalState();
    if (state.name === 'AndroidDownload' && state.downloadProgress) {
      this.handleAndroidDownload();
    }
  });

  readonly initialPermissionStateHandler = effect(async () => {
    if (this.modalState().name === 'Intro') {
      if (Capacitor.isNativePlatform()) {
        const permission = await firstValueFrom(
          this.scanningFacade.checkPermissions()
        );

        if (permission.camera === 'granted') {
          this.next(); // Skip intro screen outright
        }
      } else {
        const skipIntoSet =
          window.localStorage.getItem(DO_NOT_SHOW_STORAGE_KEY) === 'true';
        if (skipIntoSet) {
          this.next();
        }
      }
    }
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

  readonly androidModelDownloadProgress = signal(0);

  constructor(
    private readonly httpClient: HttpClient,
    private readonly translocoService: TranslocoService,
    private readonly scanningFacade: BarcodeScannerFacade
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

  // Navigate to the next step based on the current state
  public next() {
    switch (this.modalState().name) {
      case 'Error':
        this.enableScanner();
        break;
      case 'Intro':
        this.enableScanner();
        break;
      case 'AndroidDownload':
        this.enableScanner();
        break;
      default:
        return;
    }
  }

  public setBarcode(result: string) {
    this.modalState.set({ name: 'Loading' });
    this.detection$.next(result);
  }

  public async enableScanner() {
    // The Google module is only needed for scanning on android,
    // on iOS the scanning is handled by built in functionality
    const shouldCheckGoogleModule =
      Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
    if (shouldCheckGoogleModule) {
      const googleModuleAvailable = await firstValueFrom(
        this.scanningFacade.isGoogleBarcodeScannerModuleAvailable()
      );

      if (!googleModuleAvailable.available) {
        this.handleAndroidDownload();

        return;
      }
    }

    this.modalState.set({
      name: 'Scanner',
      method: Capacitor.isNativePlatform() ? 'native' : 'web',
    });
  }

  public pushError(error: Error | string) {
    this.error$.next(error);
  }

  public reset() {
    this.modalState.set(initialState);
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
        timeout(5000),
        catchError((err, _caught) => {
          if (err.error?.detail?.code) {
            this.error$.next(err.error.detail.code);
          } else if (err.name) {
            this.error$.next(err.name);
          } else {
            this.error$.next(err);
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

  /**
   * Handle the download of the Google Play Services scan module if not already downloaded
   * @param enableAfterCompletion go ahead to the scan state after the download has finished defaults to true
   **/
  private async handleAndroidDownload(enableAfterCompletion = true) {
    const isAvailable = await firstValueFrom(
      this.scanningFacade.isGoogleBarcodeScannerModuleAvailable()
    );

    if (isAvailable.available) {
      this.enableScanner();

      return;
    }

    const downloadEventHandler = await firstValueFrom(
      this.scanningFacade.addGoogleDownloadListener((event) => {
        this.modalState.set({
          name: 'AndroidDownload',
          downloadProgress: event.progress,
          downloadState: event.state,
          inProgress: true,
        });

        if (event.progress >= 100) {
          downloadEventHandler.remove();
          if (enableAfterCompletion) {
            this.enableScanner();
          }
        }
      })
    );

    this.modalState.set({
      name: 'AndroidDownload',
      downloadState: GoogleBarcodeScannerModuleInstallState.UNKNOWN,
      downloadProgress: 0,
      inProgress: true,
    });
    await firstValueFrom(
      this.scanningFacade.installGoogleBarcodeScannerModule()
    );
  }

  public async nativePermissionGranted() {
    const result = await firstValueFrom(this.scanningFacade.checkPermissions());

    return result.camera === 'granted';
  }
}

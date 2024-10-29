/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable unicorn/prefer-event-target */
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { InfoBannerComponent } from '@schaeffler/feedback-banner';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BarcodeScannerFacade } from './barcode-scanner.facade';
import { ScannedState, ScannerState } from './scan.models';
import { ScanService } from './scan.service';

const DO_NOT_SHOW_STORAGE_KEY = 'camera-prompt-donotshow';

interface EventData {
  [key: string]: number | string | object | boolean;
  name: string;
}

@Component({
  selector: 'ga-scanner',
  templateUrl: './scan-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ZXingScannerModule,
    InfoBannerComponent,
    MatCheckboxModule,
    RouterModule,
    MatIconModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    MatProgressBarModule,
  ],
})
export class ScanDialogComponent implements OnInit, OnDestroy {
  @Input() language = 'en';

  @Output() events = new EventEmitter<EventData>();

  @Output() selectDesignation = new EventEmitter<string>();

  public notShowAgain = false;
  public readonly allowedCodes = [BarcodeFormat.DataMatrix];

  public readonly state = this.scanService.state;
  public readonly trackingState = computed(() => this.state().name);
  public readonly shouldShowScanComponent = computed(
    () => this.state().name === 'Scanner' && !Capacitor.isNativePlatform()
  );

  readonly mobileScanEffect = effect(async () => {
    if (this.state().name === 'Scanner') {
      const nativeState = this.state() as ScannerState;
      if (nativeState.method && nativeState.method === 'native') {
        this.showNativeScanner();
      }
    }
  });

  public readonly androidModelDownloadProgress = new BehaviorSubject(0);

  readonly scanResultTracker = effect(() => {
    if (this.state().name === 'Scanned') {
      const casted = this.state() as ScannedState;
      this.track('scanned', {
        flag: casted.codeFlag,
        gaSupported: casted.greaseAppSupport,
        productCode: casted.productCode,
      });
    }
  });

  public readonly gaSupported = computed(() => {
    if (this.state().name !== 'Scanned') {
      return false;
    }
    const state = this.state() as ScannedState;

    return state.greaseAppSupport;
  });
  public readonly errorState = this.scanService.errorState;

  public destroy$ = new Subject();

  private readonly trackingObservable = toObservable(this.trackingState);

  constructor(
    private readonly dialogRef: DialogRef,
    public readonly scanService: ScanService,
    private readonly router: Router,
    private readonly scanningFacade: BarcodeScannerFacade
  ) {}

  ngOnInit() {
    this.dialogRef.addPanelClass(['w-full', '!max-w-3xl', 'scan-dialog']);
    this.dialogRef.config.disableClose = true;
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).url.split('/').pop() as string)
      )
      .subscribe((path) => {
        if (path !== 'scan') {
          this.dialogRef.close();
          this.scanService.reset();
        }
      });
    this.trackingObservable
      .pipe(distinctUntilChanged())
      .subscribe((event) => this.track(event));
  }

  track(name: string, data?: Omit<EventData, 'name'>) {
    this.events.emit({ name, ...data });
  }

  next() {
    if (this.state().name === 'Intro') {
      window.localStorage.setItem(
        DO_NOT_SHOW_STORAGE_KEY,
        `${this.notShowAgain}`
      );
    }
    this.scanService.next();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.stopNativeScan();
  }

  handleDetection(result: string) {
    this.track('code_scanned', { result });
    this.scanService.setBarcode(result);
  }

  close(): void {
    this.router.navigate(['/']);
  }

  showScanner(): void {
    this.scanService.enableScanner();
  }

  handleCameraNotFound() {
    this.track('nocamera');
    this.scanService.pushError('nocamera');
  }

  selectBearing() {
    const designation = this.scanService.designation();
    this.track('select_bearing', { designation });
    this.selectDesignation.emit(designation);
  }

  handlePermissionResponse(has: any) {
    if (!has) {
      this.scanService.pushError('nopermissions');
    }
  }

  async showNativeScanner() {
    const permissionsGranted = await this.handlePermissionRequest();
    if (!permissionsGranted) {
      this.scanService.pushError('nopermissions');

      return;
    }

    this.scanningFacade
      .scan({
        formats: [BarcodeFormat.DataMatrix],
      })
      .subscribe((result) => {
        if (result.barcodes.length > 0) {
          this.track('code_scanned', { result: result.barcodes[0].rawValue });
          this.scanService.setBarcode(result.barcodes[0].rawValue);
        }
        this.stopNativeScan();
      });
    // Note: This has to be here as the current version of the scanning library does appear to not automatically hide the remains of the scanner view
    // document.querySelector('body')?.classList.remove('barcode-scanner-active');
  }

  async handlePermissionRequest() {
    if (await this.scanService.nativePermissionGranted()) {
      return true;
    } else {
      const response = await firstValueFrom(
        this.scanningFacade.requestPermissions()
      );

      return response.camera === 'granted';
    }
  }

  stopNativeScan() {
    this.scanningFacade.stopScan();
  }
}

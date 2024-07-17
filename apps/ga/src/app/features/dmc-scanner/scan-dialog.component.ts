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
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { distinctUntilChanged, filter, map, Subject, takeUntil } from 'rxjs';

import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { InfoBannerComponent } from '@schaeffler/feedback-banner';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ScannedState } from './scan.models';
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
  ],
})
export class ScanDialogComponent implements OnInit, OnDestroy {
  @Input() language = 'en';

  @Output() events = new EventEmitter<EventData>();

  @Output() selectDesignation = new EventEmitter<string>();

  public notShowAgain = false;
  public readonly allowedCodes = [BarcodeFormat.DATA_MATRIX];

  public readonly state = this.scanService.state;
  public readonly trackingState = computed(() => this.state().name);

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

  constructor(
    private readonly dialogRef: DialogRef,
    public readonly scanService: ScanService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.dialogRef.addPanelClass(['w-full', '!max-w-3xl', 'scan-dialog']);
    this.dialogRef.config.disableClose = true;
    this.restoreDoNotShowState();

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

    toObservable(this.trackingState)
      .pipe(distinctUntilChanged())
      .subscribe(this.track);
  }

  track(name: string, data?: Omit<EventData, 'name'>) {
    this.events.emit({ name, ...data });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  restoreDoNotShowState() {
    this.notShowAgain =
      window.localStorage.getItem(DO_NOT_SHOW_STORAGE_KEY) === 'true';
    if (this.notShowAgain) {
      this.showScanner();
    }
  }

  handleDetection(result: string) {
    this.track('code_scanned', { result });
    this.scanService.setBarcode(result);
  }

  close(): void {
    this.router.navigate(['/']);
  }

  showScanner(): void {
    window.localStorage.setItem(
      DO_NOT_SHOW_STORAGE_KEY,
      `${this.notShowAgain}`
    );
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
}

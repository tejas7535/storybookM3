import { Injectable } from '@angular/core';

import { from } from 'rxjs';

import {
  BarcodeScannedEvent,
  BarcodeScanner,
  GoogleBarcodeScannerModuleInstallProgressEvent,
  ScanOptions,
} from '@capacitor-mlkit/barcode-scanning';

@Injectable({ providedIn: 'root' })
export class BarcodeScannerFacade {
  checkPermissions() {
    return from(BarcodeScanner.checkPermissions());
  }

  requestPermissions() {
    return from(BarcodeScanner.requestPermissions());
  }

  scan(options?: ScanOptions) {
    return from(BarcodeScanner.scan(options));
  }

  stopScan() {
    return from(BarcodeScanner.stopScan());
  }

  removeAllListeners() {
    return from(BarcodeScanner.removeAllListeners());
  }

  installGoogleBarcodeScannerModule() {
    return from(BarcodeScanner.installGoogleBarcodeScannerModule());
  }

  addListener(
    eventName: 'barcodeScanned',
    listenerFunc: (event: BarcodeScannedEvent) => void
  ) {
    return from(BarcodeScanner.addListener(eventName, listenerFunc));
  }

  addGoogleDownloadListener(
    listenerFunc: (
      event: GoogleBarcodeScannerModuleInstallProgressEvent
    ) => void
  ) {
    return from(
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        listenerFunc
      )
    );
  }

  isGoogleBarcodeScannerModuleAvailable() {
    return from(BarcodeScanner.isGoogleBarcodeScannerModuleAvailable());
  }
}

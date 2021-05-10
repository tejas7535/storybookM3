import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetectionService {
  constructor(readonly platform: Platform) {}

  public isUnsupportedBrowser(): boolean {
    return !this.platform.BLINK;
  }
}

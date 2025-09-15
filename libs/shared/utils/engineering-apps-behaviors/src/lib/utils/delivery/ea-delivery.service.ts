import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { EMAPlatform } from './ea-delivery.interface';
import { DEFAULT_ASSETS_PATH, EA_CAPACITOR } from './ea-delivery.token';

@Injectable()
export class EaDeliveryService {
  private readonly eaCapacitor = inject(EA_CAPACITOR);
  private readonly defaultAssetsPath = inject(DEFAULT_ASSETS_PATH);

  private readonly _isMobile: WritableSignal<boolean>;
  private readonly _platform: WritableSignal<EMAPlatform | undefined>;
  private readonly _assetsPath: Signal<string>;

  public constructor() {
    this._isMobile = signal(
      this.eaCapacitor && this.eaCapacitor.isNativePlatform()
    );
    this._platform = signal(
      this._isMobile()
        ? (this.eaCapacitor.getPlatform() as EMAPlatform)
        : undefined
    );
    this._assetsPath = computed(() => {
      if (this._isMobile()) {
        if (this._platform() === EMAPlatform.IOS) {
          return 'capacitor://localhost/assets';
        }

        if (this._platform() === EMAPlatform.ANDROID) {
          return 'https://localhost/assets';
        }
      }

      return this.defaultAssetsPath;
    });
  }

  public get isMobile(): Signal<boolean> {
    return this._isMobile.asReadonly();
  }

  public get platform(): Signal<EMAPlatform | undefined> {
    return this._platform.asReadonly();
  }

  public get assetsPath(): Signal<string> {
    return this._assetsPath;
  }
}

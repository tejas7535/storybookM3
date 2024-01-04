import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { SettingsFacade } from '@ga/core/store/facades/settings.facade';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  readonly assetsBasePath = '/assets/images/';
  readonly schaefflerLogoPath = `${this.assetsBasePath}schaeffler-logo.png`;

  public schaefflerLogo$ = this.http
    .get(this.schaefflerLogoPath, { responseType: 'blob' })
    .pipe(switchMap((blob) => this.readBlob(blob)));

  public partnerVersionlogo$ = this.settingsFacade.partnerVersion$.pipe(
    filter(Boolean),
    switchMap((partnerVersion: string) =>
      this.loadPartnerVersionLogo(partnerVersion)
    )
  );

  constructor(
    private readonly http: HttpClient,
    private readonly settingsFacade: SettingsFacade
  ) {}

  private loadPartnerVersionLogo(partnerVersion: string): Observable<string> {
    return this.http
      .get(
        `${this.assetsBasePath}partner-version-logos/${partnerVersion}.png`,
        { responseType: 'blob' }
      )
      .pipe(switchMap((blob) => this.readBlob(blob)));
  }

  private readBlob(blob: Blob): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next(reader.result?.toString() || '');
        observer.complete();
      };
      reader.readAsDataURL(blob);
    });
  }
}

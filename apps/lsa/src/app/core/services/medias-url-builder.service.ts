import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediasURLBuilderService {
  public getMediasBase(): string {
    const url = this.getUrl();
    const baseLocale = url.pathname.split('/').find(Boolean);

    return `${url.origin}/${baseLocale}/`;
  }

  public getMediasPDPUrl(pimId: string) {
    const baseurl = this.getMediasBase();

    return `${baseurl}p/${pimId}`;
  }

  private getUrl() {
    return window.location;
  }
}

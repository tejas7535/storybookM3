import { APP_BASE_HREF, PathLocationStrategy } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

import { StaticPlatformLocation } from './static-platform-location';

@Injectable()
export class StaticLocationStrategy extends PathLocationStrategy {
  public constructor(
    _platformLocation: StaticPlatformLocation,
    @Optional() @Inject(APP_BASE_HREF) _href?: string
  ) {
    super(_platformLocation, _href);
  }
}

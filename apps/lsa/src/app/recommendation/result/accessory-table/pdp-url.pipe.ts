import { Pipe, PipeTransform } from '@angular/core';

import { MediasURLBuilderService } from '@lsa/core/services/medias-url-builder.service';

@Pipe({
  standalone: true,
  name: 'pdpurl',
})
export class PdpPageUrlPipe implements PipeTransform {
  constructor(private readonly mediasUrlBuilder: MediasURLBuilderService) {}

  transform(value: string) {
    return this.mediasUrlBuilder.getMediasPDPUrl(value);
  }
}

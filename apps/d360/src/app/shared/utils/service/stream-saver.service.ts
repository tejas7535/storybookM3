import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import streamSaver from 'streamsaver';

import { HttpError } from '../http-client';

@Injectable({
  providedIn: 'root',
})
export class StreamSaverService {
  constructor() {
    this.initializeStreamSaver();
  }

  private async initializeStreamSaver() {
    streamSaver.mitm = '/mitm.html';

    if (typeof window !== 'undefined' && window.WritableStream === undefined) {
      // @ts-expect-error(No Error is expected here, but the type definition is not correct)
      const streamsPonyfill = await import('web-streams-polyfill/es5');
      streamSaver.WritableStream =
        streamsPonyfill.WritableStream as typeof WritableStream;
    }
  }

  public async streamResponseToFile(
    filename: string,
    httpResponse: HttpResponse<Blob>
  ): Promise<void> {
    if (!httpResponse.ok) {
      const errorDetails = httpResponse.body;
      throw new HttpError(httpResponse.status, errorDetails);
    }

    const fileStream = streamSaver.createWriteStream(filename);

    if (httpResponse.body) {
      const reader = httpResponse.body.stream().getReader();
      const writer = fileStream.getWriter();

      const pump = (): Promise<void> =>
        reader.read().then((res: any) => {
          if (res.done) {
            writer.close();
          } else {
            writer.write(res.value).then(pump);
          }
        });

      return pump();
    }
  }
}

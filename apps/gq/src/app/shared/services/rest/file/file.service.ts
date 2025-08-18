import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { saveAs } from 'file-saver';

// Define a generic type for response model
type UploadResponse<T> = T;
@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly http: HttpClient = inject(HttpClient);

  // File upload
  uploadFiles<T>(files: File[], url: string): Observable<UploadResponse<T>> {
    const formData: FormData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.http.post<UploadResponse<T>>(url, formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }

  // File download
  downloadAttachments(
    url: string,
    params?: HttpParams
  ): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      // These headers are not required and may be unnecessary/cause issues.
      // You only need Accept. responseType & observe are NOT headers.
      Accept: '*/*',
    });

    return this.http.get(url, {
      params,
      headers,
      responseType: 'blob',
      observe: 'response',
    });
  }

  saveDownloadFile(response: HttpResponse<Blob>): string {
    const fileName = this.getFileNameFromHeaders(response.headers);
    saveAs(response.body, decodeURIComponent(fileName));

    return fileName;
  }

  private getFileNameFromHeaders(headers: HttpHeaders): string {
    return headers
      .get('content-disposition')
      .split('filename*=UTF-8')[1]
      .replaceAll('"', '')
      .replaceAll("'", '');
  }
}

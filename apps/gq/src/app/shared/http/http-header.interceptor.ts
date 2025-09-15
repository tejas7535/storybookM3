import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {} from 'rxjs/operators';

import { DetailViewPaths } from '@gq/calculator/rfq-4-detail-view/service/rest/rfq-4-detail-view-paths.enum';
import { TranslocoService } from '@jsverse/transloco';

import { ApiVersion } from '../models';
import { RfqSqvCheckPaths } from '../services/rest/attachments/models/rfq-sqv-check-paths.enum';
import { QuotationPaths } from '../services/rest/quotation/models/quotation-paths.enum';
import { Rfq4PathsEnum } from '../services/rest/rfq4/models/rfq-4-paths.enum';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  private readonly HEADER_LANGUAGE_KEY = 'language';
  private readonly HEADER_CONTENT_TYPE = 'Content-Type';
  private readonly HEADER_CONTENT_TYPE_JSON = 'application/json';

  public constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isUserSettingsPost =
      request.url?.endsWith('user-settings') && request.method === 'POST';
    const isAttachmentUpload =
      request.url?.startsWith(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`
      ) &&
      request.url?.endsWith(`${QuotationPaths.PATH_ATTACHMENTS}`) &&
      request.method === 'POST';

    const isDownloadAttachment =
      request.url?.startsWith(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}`
      ) &&
      request.url?.endsWith(`${QuotationPaths.PATH_ATTACHMENT_DOWNLOAD}`) &&
      request.method === 'GET';

    const isUploadApprovalAttachment =
      request.url?.startsWith(
        `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}`
      ) &&
      request.url?.endsWith(
        `${RfqSqvCheckPaths.APPROVAL_PATH}/${RfqSqvCheckPaths.ATTACHMENTS_PATH}`
      ) &&
      request.method === 'POST';

    const isDownloadApprovalAttachment =
      request.url?.startsWith(
        `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}`
      ) &&
      request.url?.endsWith(
        `${RfqSqvCheckPaths.APPROVAL_PATH}/${RfqSqvCheckPaths.ATTACHMENTS_PATH}/${RfqSqvCheckPaths.DOWNLOAD_PATH}`
      ) &&
      request.method === 'GET';

    const isCalculatorAttachmentUpload =
      request.url?.startsWith(`${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}`) &&
      request.url?.endsWith(`${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`) &&
      request.method === 'POST';

    if (
      isAttachmentUpload ||
      isDownloadAttachment ||
      isUserSettingsPost ||
      isUploadApprovalAttachment ||
      isDownloadApprovalAttachment ||
      isCalculatorAttachmentUpload
    ) {
      return next.handle(request);
    }

    const requestWithContentTypeHeader = request.clone({
      headers: request.headers.set(
        this.HEADER_CONTENT_TYPE,
        this.HEADER_CONTENT_TYPE_JSON
      ),
    });

    const activeLang = this.translocoService.getActiveLang();
    if (
      activeLang &&
      requestWithContentTypeHeader.url?.startsWith(ApiVersion.V1)
    ) {
      const newRequest = requestWithContentTypeHeader.clone({
        headers: requestWithContentTypeHeader.headers
          .set(this.HEADER_LANGUAGE_KEY, activeLang)
          .set(this.HEADER_CONTENT_TYPE, this.HEADER_CONTENT_TYPE_JSON),
      });

      return next.handle(newRequest);
    }

    return next.handle(requestWithContentTypeHeader);
  }
}

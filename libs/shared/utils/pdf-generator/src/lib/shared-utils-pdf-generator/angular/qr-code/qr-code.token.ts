import { InjectionToken } from '@angular/core';

import { QrCodeGenerator } from './qr-code.interface';

export const QR_CODE_LIB = new InjectionToken<QrCodeGenerator>('qr-code-lib');

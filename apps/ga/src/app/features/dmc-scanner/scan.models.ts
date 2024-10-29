import { GoogleBarcodeScannerModuleInstallState } from '@capacitor-mlkit/barcode-scanning';

export interface EABackendVerificationPayload {
  bearingCode: string;
  language?: 'en' | 'de' | string;
}

export interface EABackendVerificationResponse {
  flag: 'YELLOW' | 'GREEN' | 'RED';
  pim: string;
  designation: string;
  imageUrl: string;
  bearinxDesignation: string;
  upstreamMessages: string;
  greaseAppSupport: boolean;
}

export interface ValidityResponse {
  codeFlag: 'YELLOW' | 'GREEN' | 'RED';
  logoUrl: string;
  isValidCode: string;
  productCode: string;
  flagType: string;
}

export interface IntroState {
  name: 'Intro';
  native: boolean;
}

export interface ErrorState {
  name: 'Error';
  title: string;
  description: string;
}

export interface ScannerState {
  name: 'Scanner';
  method: 'web' | 'native';
}

export interface ScannedState {
  name: 'Scanned';
  codeValue: string;
  productCode: string;
  message?: string;
  codeFlag: EABackendVerificationResponse['flag'];
  greaseAppSupport: boolean;
  pimData:
    | {
        imageUrl: string;
        bearingxDesignation: string;
      }
    | undefined;
}

export interface ModelDownloadState {
  name: 'AndroidDownload';
  downloadProgress: number;
  inProgress: true;
  downloadState: GoogleBarcodeScannerModuleInstallState;
}

export interface LoadingState {
  name: 'Loading';
}

export type DialogState =
  | IntroState
  | ErrorState
  | ScannerState
  | ScannedState
  | LoadingState
  | ModelDownloadState;

export interface ReportMetadata {
  translationKey: string;
  value: string;
}

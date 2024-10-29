import {
  Barcode,
  BarcodeFormat,
  BarcodeValueType,
  IsGoogleBarcodeScannerModuleAvailableResult,
  PermissionStatus,
} from '@capacitor-mlkit/barcode-scanning';

export const cameraPermissionGranted = {
  camera: 'granted',
} as PermissionStatus;

export const mockBarcode: Barcode = {
  rawValue: 'ABCDEFGH',
  displayValue: 'ABCDEFGH',
  bytes: [0],
  format: 'DATA_MATRIX' as BarcodeFormat,
  valueType: 'TEXT' as BarcodeValueType,
};

export const scannerAvailableResult = {
  available: true,
} as IsGoogleBarcodeScannerModuleAvailableResult;

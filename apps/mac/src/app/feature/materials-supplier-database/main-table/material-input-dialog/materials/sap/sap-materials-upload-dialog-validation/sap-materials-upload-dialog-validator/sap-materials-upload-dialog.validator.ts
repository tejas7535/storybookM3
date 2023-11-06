import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

export function sapMaterialsUploadFileValidator(): ValidatorFn {
  return (control: AbstractControl<File>): ValidationErrors | undefined => {
    const file = control.value;
    const fileExtension = getFileExtension(file);
    // Only Excel files are supported
    const valid = fileExtension === 'xls' || fileExtension === 'xlsx';

    return !!file && !valid
      ? { unsupportedFileFormat: true, params: { fileExtension } }
      : undefined;
  };
}

export function sapMaterialsUploadDataOwnerValidator(): ValidatorFn {
  return (
    control: AbstractControl<StringOption>
  ): ValidationErrors | undefined => {
    const owner = control.value;

    const valid = new RegExp(
      '^\\w{2,},\\s\\w{2,}\\s{1,2}\\w{2}/\\w+(-.+)?$'
    ).test(owner?.title);

    return !valid ? { invalidDataOwnerFormat: true } : undefined;
  };
}

function getFileExtension(file: File): string {
  if (!file) {
    return undefined;
  }

  const fileNameParts = file.name.trim().toLowerCase().split('.');

  return fileNameParts[fileNameParts.length - 1];
}

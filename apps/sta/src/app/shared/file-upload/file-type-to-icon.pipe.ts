import { Pipe, PipeTransform } from '@angular/core';

const endsWith = (fileName: string, fileType: string): boolean => {
  return fileName.indexOf(fileType, fileName.length - fileType.length) !== -1;
};

@Pipe({
  name: 'fileTypeToIcon',
})
export class FileTypeToIconPipe implements PipeTransform {
  public transform(fileName: string): string {
    let icon = 'icon-document';

    if (endsWith(fileName, '.pdf')) {
      icon = 'icon-pdf';
    } else if (endsWith(fileName, '.docx')) {
      icon = 'icon-word';
    }

    return icon;
  }
}

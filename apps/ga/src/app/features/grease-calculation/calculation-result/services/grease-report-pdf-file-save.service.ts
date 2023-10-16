/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { Share, ShareResult } from '@capacitor/share';
import { FileOpener } from '@capacitor-community/file-opener';
import jsPDF from 'jspdf';

@Injectable()
export class GreaseReportPdfFileSaveService {
  public async saveAndOpenFile(
    doc: jsPDF,
    fileName: string
  ): Promise<ShareResult | void> {
    if (Capacitor.isNativePlatform()) {
      if (Capacitor.getPlatform() === 'ios') {
        try {
          const { uri } = await this.writeFile(doc, fileName, Directory.Cache);

          return Share.share({
            files: [uri],
          });
        } catch (error) {
          console.error('unable to write file', error);
        }
      } else {
        return this.handleSaveOnAndroid(doc, fileName);
      }
    }

    // Desktop saving
    return doc.save(fileName, { returnPromise: true });
  }

  private async handleSaveOnAndroid(
    doc: jsPDF,
    fileName: string
  ): Promise<void> {
    await this.writeFile(doc, fileName, Directory.Data);

    Filesystem.getUri({
      directory: Directory.Data,
      path: fileName,
    }).then((urlResult: { uri: any }) => {
      const path = urlResult.uri;

      return FileOpener.open({
        filePath: path,
        contentType: 'application/pdf',
      });
    });
  }

  private writeFile(
    doc: jsPDF,
    fileName: string,
    directory: Directory
  ): Promise<WriteFileResult> {
    return Filesystem.writeFile({
      path: fileName,
      data: `${doc.output('datauristring')}`,
      directory,
      recursive: true,
    });
  }
}

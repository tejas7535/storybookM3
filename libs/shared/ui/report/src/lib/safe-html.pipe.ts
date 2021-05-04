import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    const result = this.sanitizer.bypassSecurityTrustHtml(value);
    return result;
  }
}

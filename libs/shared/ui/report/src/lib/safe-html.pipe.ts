import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: false,
})
export class SafeHtmlPipe implements PipeTransform {
  public constructor(private readonly sanitizer: DomSanitizer) {}

  public transform(value: string): SafeHtml {
    const result = this.sanitizer.bypassSecurityTrustHtml(value);

    return result;
  }
}

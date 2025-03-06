import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sapQuotation',
  standalone: false,
})
export class SapQuotationPipe implements PipeTransform {
  transform(value: string): string {
    return `SAP${value}`;
  }
}

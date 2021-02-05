import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gqQuotation',
})
export class GqQuotationPipe implements PipeTransform {
  transform(gqId: number): string {
    return `GQ${gqId}`;
  }
}
